import { EntityTypeTitleEnum } from './entity-type-title.enum';
import { ExaminationTypeEnum } from './examination-type.enum';
import { FormNumberEnum } from './form-number.enum';
import { OperationTypeTitleEnum } from './operation-type-title.enum';

export class TypicalViolationsEntity {
  uniqueNumber: string;
  versionDate: string;
  formNumber: FormNumberEnum;
  cardId: string;
  entityTypeTitle: EntityTypeTitleEnum;
  operationTypeTitle: OperationTypeTitleEnum;
  operationDate: string;
  userName: string;
  userPositionTitle: string;
  divisionId: string;
  divisionTitle: string;
  regionId: string;
  regionTitle: string;
  departmentId: string;
  departmentTitle: string;
  comment?: string;
  examinationTypeId: string;
  examinationTypeTitle: ExaminationTypeEnum;
  procuracyId: string;
  procuracyTitle: string;
}
