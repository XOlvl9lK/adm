import { BaseResult } from './base-result.interface';

export type GetEntriesResult<T> = BaseResult<{
  /** page number */
  number: number;
  /** number of elements on current page */
  numberOfElements: number;
  /** total entries */
  totalElements: number;
  /** calculated total pages */
  totalPages: number;
  /** page size */
  size: number;
  /** content of page */
  content: T[];
}>;
