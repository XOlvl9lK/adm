import { RequestStateEnum } from './request-state.enum';
import { SpvMethodNameEnum } from './spv-method-name.enum';

export interface SpvHistoryEntity {
  requestNumber: number;
  requestState: RequestStateEnum;
  requestMethod: {
    name: SpvMethodNameEnum;
    methodName: string;
  };
  startDate: string | Date | number;
  finishDate?: string | Date | number;
  requestXmlUrl: string;
  responseXmlUrl?: string;
  integrationName: string;
  uniqueSecurityKey: string;
}
