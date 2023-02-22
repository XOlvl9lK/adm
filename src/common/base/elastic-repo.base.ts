import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { MgetResponse, SortQuery } from '@common/utils/types';
import { map, flatMap } from 'lodash';
import { Client } from '@elastic/elasticsearch';
import { transformAuthorities } from '@common/utils/transformAuthorities';

interface FindOptions {
  page?: string | number;
  pageSize?: string | number;
  sort?: SortQuery;
  collapse?: string;
}

export interface GetFieldUniqueValues {
  field: string;
  query?: string;
  size: number;
  divisionTitles?: string[];
}

export interface RepoOptions {
  MINIMUM_PAGE_SIZE?: number;
  MAXIMUM_PAGE_SIZE?: number;
  SCROLL_TIMEOUT?: string;
  getSortSpecifiedField?: (field: string, order: 'asc' | 'desc') => [string, Record<string, unknown>] | undefined;
}

export abstract class ElasticRepoBase<T> {
  protected readonly MINIMUM_PAGE_SIZE: number;
  protected readonly MAXIMUM_PAGE_SIZE: number;
  protected readonly SCROLL_TIMEOUT: string;
  protected readonly getSortSpecifiedField?: RepoOptions['getSortSpecifiedField'];

  constructor(protected readonly client: Client, public readonly index: string, opts?: RepoOptions) {
    this.MINIMUM_PAGE_SIZE = opts?.MINIMUM_PAGE_SIZE || 10;
    this.MAXIMUM_PAGE_SIZE = opts?.MAXIMUM_PAGE_SIZE || 10_000;
    this.SCROLL_TIMEOUT = opts?.SCROLL_TIMEOUT || '5m';
    this.getSortSpecifiedField = opts?.getSortSpecifiedField;
  }

  public closeConnection() {
    return this.client.close();
  }

  protected abstract getQuery(params: any): any;

  public async findAndCount<F extends FindOptions>(findOptions: F): Promise<[SearchHit<T>[], number]> {
    const [documents, count] = await Promise.all([this.find(findOptions), this.count(findOptions)]);
    return [documents, count];
  }

  public async getFieldUniqueValues({ field, query: subString, divisionTitles }: GetFieldUniqueValues) {
    const createAggregationsField = (f: string) => {
      if (field.endsWith('.keyword')) return f;
      return `${f}.keyword`;
    };

    const aggregationsField = createAggregationsField(field);

    const query = {
      bool: {
        ...(subString?.length && { must: [{ match: { [field]: { query: subString } } }] }),
        ...(divisionTitles?.length && {
          filter: [...this.terms('divisionTitle', transformAuthorities(divisionTitles))],
        }),
      },
    };

    const response = await this.client.search<T, any>({
      index: this.index,
      query,
      aggs: {
        [aggregationsField]: {
          terms: { field: aggregationsField },
        },
      },
    });
    return response.aggregations[aggregationsField].buckets
      .map((b) => b.key)
      .filter((value) => value.toLowerCase().includes(subString.toLowerCase()))
      .slice(0, 10);
  }

  public async count<F extends FindOptions>(params: F): Promise<number> {
    const query = this.getQuery(params);
    const { count } = await this.client.count({
      index: this.index,
      query,
    });
    return count;
  }

  public async find<F extends FindOptions>(params: F): Promise<SearchHit<T>[]> {
    const { index, MINIMUM_PAGE_SIZE, MAXIMUM_PAGE_SIZE } = this;
    const { page, pageSize } = params;
    const query = this.getQuery(params);
    const sort = this.sort(params.sort);
    const size = Number(pageSize) || MINIMUM_PAGE_SIZE;
    const from = Number(page) * size - size;
    if (size + from <= MAXIMUM_PAGE_SIZE) {
      const response = await this.client.search<T>({ index, query, size, from, ...sort });
      return response.hits.hits;
    } else {
      const batches = [];
      const generator = await this.createSearchGenerator(params);
      for await (const documents of generator()) {
        batches.push(...documents);
      }
      return batches;
    }
  }

  public async createSearchGenerator<F extends FindOptions>({
    page,
    pageSize,
    sort,
    ...queryParams
  }: F): Promise<() => AsyncGenerator<SearchHit<T>[]>> {
    const { index, client, SCROLL_TIMEOUT, MAXIMUM_PAGE_SIZE } = this;
    const query = this.getQuery(queryParams);
    const pagination = this.processPagination(page, pageSize);
    const sorting = this.sort(sort);
    const indexLength = await this.count(queryParams);
    return async function* () {
      if (Number(page) * Number(pageSize) > indexLength) {
        return [];
      }

      let response = await client.search<T>({
        index,
        query,
        ...sorting,
        size: MAXIMUM_PAGE_SIZE,
        scroll: SCROLL_TIMEOUT,
      });
      for (let i = 0; i < pagination.dummyCalls; i++) {
        response = await client.scroll<T>({
          scroll_id: response._scroll_id,
          scroll: SCROLL_TIMEOUT,
        });
      }
      if (pagination.remainderLeftBorder > 0 || pagination.remainderRightBorder > 0) {
        yield response.hits.hits.slice(pagination.remainderLeftBorder, pagination.remainderRightBorder);
      }

      for (let i = 0; i < pagination.requiredScrolls; i++) {
        if (response.hits.hits.length === 0) break;
        if (i === pagination.requiredScrolls - 1 && pagination.takeFromLast > 0) {
          yield response.hits.hits.slice(0, pagination.takeFromLast);
          break;
        } else {
          yield response.hits.hits;
        }
        if (!response._scroll_id) break;
        response = await client.scroll<T>({
          scroll_id: response._scroll_id,
          scroll: SCROLL_TIMEOUT,
        });
      }
    };
  }

  private processPagination(page: string | number, pageSize: string | number) {
    const { MINIMUM_PAGE_SIZE, MAXIMUM_PAGE_SIZE } = this;
    page = Number(page) || 1;
    pageSize = Number(pageSize) || MINIMUM_PAGE_SIZE;
    const skip = page * pageSize;
    const dummyCalls = Math.floor(skip / MAXIMUM_PAGE_SIZE);
    const remainderLeftBorder = Math.max(
      ((skip % MAXIMUM_PAGE_SIZE) - pageSize + MAXIMUM_PAGE_SIZE) % MAXIMUM_PAGE_SIZE,
      0,
    );
    let remainderRightBorder = Math.abs(MAXIMUM_PAGE_SIZE - (skip % MAXIMUM_PAGE_SIZE) - MAXIMUM_PAGE_SIZE);
    remainderRightBorder = remainderRightBorder === 0 ? MAXIMUM_PAGE_SIZE : remainderRightBorder;
    const requiredDocuments = pageSize - (MAXIMUM_PAGE_SIZE - remainderRightBorder);
    const requiredPageScrollSize = requiredDocuments > 0 ? requiredDocuments : 0;
    const requiredScrolls = Math.ceil(requiredPageScrollSize / MAXIMUM_PAGE_SIZE);
    const takeFromLast = requiredPageScrollSize % MAXIMUM_PAGE_SIZE;
    return { dummyCalls, remainderLeftBorder, remainderRightBorder, requiredScrolls, takeFromLast };
  }

  public transformFindResponse(documents: SearchHit<T>[]): (T & { id: string })[] {
    return map(documents, (document) => ({ id: document._id, ...document._source }));
  }

  public transformMgetResponse(documents: MgetResponse<T>): (T & { id: string })[] {
    return flatMap(documents.docs, (document) =>
      'error' in document ? [] : [{ id: document._id, ...document._source }],
    );
  }

  public async getByIds(values: string[], sort?: Record<string, 'ASC' | 'DESC'>): Promise<SearchHit<T>[]> {
    const response = await this.client.search<T>({
      query: {
        ids: { values },
      },
      ...(sort && this.sort(sort)),
      size: values.length,
    });
    return response.hits.hits;
  }

  protected pagination(page?: string | number, pageSize?: string | number) {
    if (page && pageSize) {
      return {
        size: Number(pageSize),
        from: (Number(page) - 1) * Number(pageSize),
      };
    }
    return {};
  }

  protected match(field: string, value?: string) {
    if (value) {
      return [
        {
          match: {
            [field]: {
              query: value,
            },
          },
        },
      ];
    }
    return [];
  }

  protected term(field: string, value?: string | number | boolean) {
    if (value) {
      return [
        {
          term: {
            [field]: value,
          },
        },
      ];
    }
    return [];
  }

  protected range(field: string, from?: string, to?: string) {
    if (from || to) {
      return [
        {
          range: {
            [field]: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          },
        },
      ];
    }
    return [];
  }

  protected sort(sort?: Record<string, 'ASC' | 'DESC'>) {
    if (!sort) return { sort: {} };
    const { getSortSpecifiedField } = this;
    return {
      sort: Object.entries(sort).reduce((acc, [key, direction]) => {
        const order = direction.toLocaleLowerCase() as 'asc' | 'desc';
        const [_key, options] = getSortSpecifiedField?.(key, order) || [
          key,
          { missing: order === 'asc' ? '_first' : '_last', order },
        ];
        acc[_key] = options;
        return acc;
      }, {}),
    };
  }

  protected terms(field: string, value?: (string | number | boolean)[]) {
    if (value?.length) {
      return [
        {
          terms: {
            [field]: value,
          },
        },
      ];
    }
    return [];
  }

  protected exists(field: string, condition: boolean) {
    if (condition) {
      return [
        {
          exists: {
            field,
          },
        },
      ];
    }
    return [];
  }

  protected collapse(collapse?: string) {
    if (collapse) {
      return {
        collapse: {
          field: collapse,
        },
      };
    }
    return {};
  }
}
