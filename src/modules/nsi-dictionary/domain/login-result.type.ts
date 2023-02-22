import { BaseResult } from './base-result.interface';

export type LoginResult = BaseResult<{
  //date as string
  created: string;
  //date as string
  usageTime: string;
  //date as string
  lifeTime: string;
  inactivityTime: string;
}>;
