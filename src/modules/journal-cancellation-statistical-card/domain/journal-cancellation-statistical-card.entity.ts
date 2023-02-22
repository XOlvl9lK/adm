import { FormNumberEnum } from '@modules/journal-cancellation-statistical-card/domain/form-number.enum';
import { OperationTypeEnum } from '@modules/journal-cancellation-statistical-card/domain/operation-type.enum';

export class JournalCancellationStatisticalCardEntity {
  uniqId: string;
  idVersion: string;
  ikud: string;
  formNumber: FormNumberEnum;
  uniqueNumber: string;
  versionDate: string;
  cardId: string;
  operationTypeTitle: OperationTypeEnum;
  operationDate: string;
  sourceTitle: string;
  comment: string;
  userLogin: string;
  divisionId: string;
  divisionTitle: string;
  departmentId: string;
  departmentTitle: string;
  regionId: string;
  regionTitle: string;
  procuracyTitle: string;
  procuracyId: string;
}
