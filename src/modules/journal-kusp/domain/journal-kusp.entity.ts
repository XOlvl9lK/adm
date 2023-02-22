import { SourceEnum } from '@modules/journal-kusp/domain/source.enum';
import { StatusEnum } from '@modules/journal-kusp/domain/status.enum';

export type Signer = {
  divisionTitle: string;
  role: string;
  fullName: string;
  position: string;
  certificate: string;
  signDate: string;
};

type KuspNumber = {
  uniqId: string;
  idVersion: string;
  number: string;
  statusTitle: StatusEnum;
  errorText: string;
};

export class JournalKuspEntity {
  loadId: string;
  fileTitle: string;
  packageKuspId: string;
  createDate: string;
  allPackageRecordsNumber: number;
  downloadedRecordsNumber: number;
  errorProcessedRecordsNumber: number;
  sourceTitle: SourceEnum;
  startProcessingDate: string;
  endProcessingDate: string;
  packageSignatureDate: string;
  operatorLogin: string;
  statusTitle: StatusEnum;
  divisionId: string;
  divisionTitle: string;
  regionId: string;
  regionTitle: string;
  departmentId: string;
  departmentTitle: string;
  kuspNumber: KuspNumber[];
  fileLink: string;
  signer?: Signer[];
}
