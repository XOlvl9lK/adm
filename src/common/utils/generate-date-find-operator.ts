import { FindOperator, LessThanOrEqual, MoreThanOrEqual, Between } from 'typeorm';

export const generateDateFindOperator = (
  from?: string | Date | number,
  to?: string | Date | number,
): FindOperator<Date> => {
  if (from && !to) return MoreThanOrEqual(new Date(from));
  if (!from && to) return LessThanOrEqual(new Date(to));
  if (from && to) return Between(new Date(from), new Date(to));
  return undefined;
};
