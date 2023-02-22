import { FormNumberEnum } from './form-number.enum';
import { OperationTypeTitleEnum } from './operation-type-title.enum';

export class CancellationRecordCardEntity {
  uniqId: string;
  idVersion: string;
  uniqueNumber: string;
  cardId: string;
  formNumber: FormNumberEnum;
  operationDate: string;
  operationTypeTitle: OperationTypeTitleEnum;
  comment: string;
  userLogin: string;
  responseMeasureId: string;
  responseMeasureTitle: string;
  divisionId: string;
  divisionTitle: string;
  regionId: string;
  regionTitle: string;
  departmentId: string;
  departmentTitle: string;
}
