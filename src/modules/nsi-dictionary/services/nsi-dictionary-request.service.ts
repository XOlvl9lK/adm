import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NsiDictionaryHttpTransport } from '../infrastructure/nsi-dictionary.http-transport';
import { GetEntriesResult } from '../domain/get-entries-result.type';
import { ConfigService } from '@nestjs/config';
import { NsiDepartment } from '../domain/nsi-department.interface';
import { NsiRegion } from '../domain/nsi-region.interface';
import { NsiSubdivision } from '../domain/nsi-subdivision.interface';
import { NsiResponseMeasure } from '../domain/nsi-response-measure.interface';
import { NsiProsecutorOffice } from '../domain/nsi-prosecutor-office.interface';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NsiCacheKey, NsiCacheValue } from '@modules/nsi-dictionary/infrastructure/cache.service.interface';
import { LocalCacheService } from '@modules/nsi-dictionary/infrastructure/local-cache.service';
import { isDev } from '../../../app.module';
import { filter } from 'lodash';

export const CACHE_UPDATED_EVENT = 'CACHE_UPDATED_EVENT';

@Injectable()
export class NsiDictionaryRequestService extends LocalCacheService implements OnModuleInit {
  private readonly dataHeapSize = Number.parseInt(this.configService.get<string>('NSI_DICTIONARY_DATA_HEAP_SIZE'));
  protected readonly requestChunkSize = 10;

  private readonly catalogueId = {
    region: '7a90c84f-ebb7-4e11-8a6d-3d605f4cb9d3',
    department: 'db4aa011-dacd-4938-be11-923c89fcf106',
    subdivision: '23fa3f32-e0ad-4361-995b-4f34a0d07201',
    responseMeasure: '25f90676-284a-4403-bc15-b33cd34a5ca3',
    prosecutorOffice: '23fa3f32-e0ad-4361-995b-4f34a0d07201',
  };

  constructor(
    private transport: NsiDictionaryHttpTransport,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  @Cron(CronExpression.EVERY_3_HOURS)
  async updateCacheScheduler() {
    // await this.updateCache();
    // this.eventEmitter.emit(CACHE_UPDATED_EVENT);
  }

  async onModuleInit() {
    // if (!isDev) {
    //   await this.updateCache();
    // }
  }

  private async updateCache() {
    try {
      this.clearCache();
      const [regions, departments, subdivisions, prosecutorOffices, responseMeasures] = await Promise.all([
        this.getRegions(true),
        this.getDepartments(true),
        this.getSubdivisions(true),
        this.getProsecutorOffices(true),
        this.getResponseMeasures(true),
      ]);

      this.setCacheValue({ key: 'region', value: regions });
      this.setCacheValue({ key: 'department', value: departments });
      this.setCacheValue({ key: 'subdivision', value: subdivisions });
      this.setCacheValue({ key: 'prosecutorOffice', value: prosecutorOffices });
      this.setCacheValue({ key: 'responseMeasure', value: responseMeasures });
      this.updateLastCleanDate();
      Logger.log('Nsi cache updated', 'Scheduler');
    } catch (e) {
      console.log(e);
    }
  }

  private async processAuthorities<T extends NsiCacheValue>(
    elementId: string,
    cacheKey: NsiCacheKey,
    force?: boolean,
    body?: any,
  ): Promise<T[]> {
    const cacheValue = this.getCacheValue<T>(cacheKey);
    if (!force && cacheValue?.length) {
      return cacheValue;
    }
    const {
      data: { totalElements },
    } = await this.getNsiElements<T>(elementId, { page: 0, size: 1 }, body);
    const payloads = new Array(Math.ceil(totalElements / this.dataHeapSize)).fill(1).map((e, i) => ({
      page: i,
      size: this.dataHeapSize,
    }));
    let results;
    if (cacheKey === 'subdivision') {
      results = await this.getInSeries<T>(elementId, payloads, body);
    } else {
      results = await Promise.all(payloads.map((params) => this.getNsiElements<T>(elementId, params, body)));
    }
    const resultsFlat = results.flatMap((result) => result.data.content);
    if (!force && !cacheValue?.length) {
      this.setCacheValue({ key: cacheKey, value: resultsFlat });
    }
    return resultsFlat;
  }

  async getRegions(force?: boolean): Promise<NsiRegion[]> {
    return await this.processAuthorities<NsiRegion>(this.catalogueId.region, 'region', force, {
      view: { type: 'table', config: {} },
    });
  }

  async getDepartments(force?: boolean): Promise<NsiDepartment[]> {
    return await this.processAuthorities<NsiDepartment>(this.catalogueId.department, 'department', force, {
      view: { type: 'table', config: {} },
    });
  }

  async getSubdivisions(
    force?: boolean,
    filters?: { departmentId: string; regionId?: string },
  ): Promise<NsiSubdivision[]> {
    const body = { view: { type: 'table', config: {} } };
    const data = await this.processAuthorities<NsiSubdivision>(
      this.catalogueId.subdivision,
      'subdivision',
      force,
      body,
    );
    if (filters) {
      return this.filterSubdivisions(data, filters.departmentId, filters.regionId);
    }
    return data;
  }

  async getSubdivisionsFiltered(departmentId: string, regionId?: string, force?: boolean): Promise<NsiSubdivision[]> {
    const body = {
      filter: {
        category: 'PREDICATE',
        operation: 'AND',
        operands: [
          {
            category: 'PREDICATE',
            operation: 'EQ',
            operands: [
              {
                category: 'FUNCTION',
                type: 'UUID',
                operation: 'POINTER',
                operands: [
                  {
                    category: 'ENTITY_ATTRIBUTE',
                    type: 'REFERENCE',
                    rank: 'VALUE',
                    field: {
                      schema: 'public',
                      table: 'entry_version',
                      field: 'data',
                    },
                    path: 'VED_ID',
                  },
                ],
              },
              {
                category: 'LITERAL',
                type: 'UUID',
                value: departmentId,
                source: {
                  title: 'Справочник №2 "Ведомства, осуществляющие расследование преступлений"',
                  category: 'CATALOGUE_ENTRY_ID',
                  service: 'mdm',
                  register: 'element',
                  catalogue: this.catalogueId.department,
                  version: null,
                  type: 'UUID',
                  key: 34175671,
                  displayField: 'NAME',
                },
              },
            ],
          },
          ...(regionId
            ? [
                {
                  category: 'PREDICATE',
                  operation: 'EQ',
                  operands: [
                    {
                      category: 'FUNCTION',
                      type: 'UUID',
                      operation: 'POINTER',
                      operands: [
                        {
                          category: 'ENTITY_ATTRIBUTE',
                          type: 'REFERENCE',
                          rank: 'VALUE',
                          field: {
                            schema: 'public',
                            table: 'entry_version',
                            field: 'data',
                          },
                          path: 'OKATO_ID',
                        },
                      ],
                    },
                    {
                      category: 'LITERAL',
                      type: 'UUID',
                      value: regionId,
                      source: {
                        title: 'ОКТМО',
                        category: 'CATALOGUE_ENTRY_ID',
                        service: 'mdm',
                        register: 'element',
                        catalogue: this.catalogueId.region,
                        version: null,
                        type: 'UUID',
                        key: 71182501,
                        displayField: 'NAME',
                      },
                    },
                  ],
                },
              ]
            : []),
        ],
      },
      view: {
        type: 'table',
        config: {},
      },
    };
    return await this.processAuthorities<NsiSubdivision>(this.catalogueId.subdivision, 'subdivision', force, body);
  }

  async getResponseMeasures(force?: boolean): Promise<NsiResponseMeasure[]> {
    const body = { view: { type: 'table', config: {} } };
    return await this.processAuthorities<NsiResponseMeasure>(
      this.catalogueId.responseMeasure,
      'responseMeasure',
      force,
      body,
    );
  }

  async getProsecutorOffices(force?: boolean): Promise<NsiProsecutorOffice[]> {
    const body = {
      filter: {
        category: 'PREDICATE',
        operation: 'AND',
        operands: [
          {
            category: 'PREDICATE',
            operation: 'EQ',
            operands: [
              {
                category: 'FUNCTION',
                type: 'UUID',
                operation: 'POINTER',
                operands: [
                  {
                    category: 'ENTITY_ATTRIBUTE',
                    type: 'REFERENCE',
                    rank: 'VALUE',
                    field: {
                      schema: 'public',
                      table: 'entry_version',
                      field: 'data',
                    },
                    path: 'VED_ID',
                  },
                ],
              },
              {
                category: 'LITERAL',
                type: 'UUID',
                value: '71ca12f6-987a-44bb-a573-582d708de071',
                source: {
                  title: 'Справочник №2 "Ведомства, осуществляющие расследование преступлений"',
                  category: 'CATALOGUE_ENTRY_ID',
                  service: 'mdm',
                  register: 'element',
                  catalogue: 'db4aa011-dacd-4938-be11-923c89fcf106',
                  version: null,
                  type: 'UUID',
                  key: 34175671,
                  displayField: 'NAME',
                },
              },
            ],
          },
        ],
      },
      view: { type: 'table', config: {} },
    };
    return await this.processAuthorities<NsiProsecutorOffice>(
      this.catalogueId.prosecutorOffice,
      'prosecutorOffice',
      force,
      body,
    );
  }

  private async getNsiElements<T>(
    elementId: string,
    params: Record<string, unknown> = {},
    data: Record<string, unknown> = {},
  ): Promise<GetEntriesResult<T>> {
    await this.transport.updateAuthCookie();
    const result = await this.transport.request<GetEntriesResult<T>>({
      method: 'POST',
      url: `api/v1/mdm/elements/${elementId}/entries/getEntries`,
      headers: { Cookie: this.transport.Cookie },
      params,
      data,
    });
    return result.data;
  }

  private async getInSeries<T>(elementId: string, payloads: { page: number; size: number }[], body: any) {
    const result = [];
    let length = this.requestChunkSize;
    for (let i = 0; i < payloads.length; i += this.requestChunkSize) {
      if (i + this.requestChunkSize >= payloads.length) {
        length = payloads.length - i;
      }
      const response = await Promise.all(
        Array.from({ length }).map((_, idx) => this.getNsiElements<T>(elementId, payloads[i + idx], body)),
      );
      result.push(...response);
    }
    return result;
  }

  private filterSubdivisions(subdivisions: NsiSubdivision[], departmentId: string, regionId?: string) {
    return filter(subdivisions, (subdivision) => {
      const department = subdivision.version.data.VED_ID?.pointer;
      const region = subdivision.version.data.OKATO_ID?.pointer;
      return regionId ? department?.id === departmentId && region?.id === regionId : department?.id === departmentId;
    });
  }
}
