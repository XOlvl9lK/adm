import { OperationTypeTitleEnum } from './operation-type-title.enum';

export class CancellationKuspEntity {
  uniqId: string;
  idVersion: string;
  kuspNumber: string;
  registrationDate: string;
  solutionTitle: string;
  versionDate: string;
  operationTypeTitle: OperationTypeTitleEnum;
  operationDate: string;
  userLogin: string;
  comment?: string;
  divisionId: string;
  divisionTitle: string;
  departmentId: string;
  departmentTitle: string;
  regionId: string;
  regionTitle: string;
  procuracyId: string;
  procuracyTitle: string;
  allPackageRecordsNumber: number;
}
