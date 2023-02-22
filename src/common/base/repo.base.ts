import { Repository } from 'typeorm';

export class RepoBase<E> extends Repository<E> {
  protected processSortQueryRaw(sortQuery?: Record<string, 'ASC' | 'DESC'>) {
    if (sortQuery) {
      const sortKey = Object.keys(sortQuery)[0];
      const sortValue = sortQuery[sortKey];
      return {
        sortKey,
        sortValue,
      };
    }
    return { sortKey: undefined, sortValue: undefined };
  }

  protected processWhereQueryRaw(alias: string, where: string, condition?: boolean) {
    return condition ? `${alias}.${where}` : `${alias}.id::varchar ILIKE '%%'`;
  }

  protected createOrdering(sortQuery?: Record<string, 'ASC' | 'DESC'>) {
    const sortObject = {};
    Object.entries(sortQuery || {}).map(([key, value]) => {
      const props = key.split('.');
      props.reduce((acc, prop, i) => {
        if (i === props.length - 1) {
          acc[prop] = value;
        } else {
          acc[prop] = acc[prop] || {};
          return acc[prop];
        }
      }, sortObject);
    });
    return sortObject;
  }
}
