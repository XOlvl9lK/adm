import { FormNumberEnum } from '@modules/journal-cancellation-statistical-card/domain/form-number.enum';
import { StatisticalCardSourceEnum } from '@modules/journal-statistical-card/domain/statistical-card-source.enum';
import { StatisticalCardStatusEnum } from '@modules/journal-statistical-card/domain/statistical-card-status.enum';
import { Signer } from '@modules/journal-kusp/domain/journal-kusp.entity';

type Status = {
  date: string;
  title: StatisticalCardStatusEnum;
  errorDescription?: {
    requisite?: string;
    text?: string;
  }[];
};

export class JournalStatisticalCardEntity {
  loadId: string;
  uniqId: string;
  idVersion: string;
  cardId: string;
  ikud: string;
  formNumber: FormNumberEnum;
  sourceTitle: StatisticalCardSourceEnum;
  startProcessingDate: string;
  endProcessingDate: string;
  operatorLogin: string;
  status?: Status[];
  statusTitle: StatisticalCardStatusEnum;
  isProsecutorChange: boolean;
  divisionId: string;
  divisionTitle: string;
  departmentId: string;
  departmentTitle: string;
  regionId: string;
  regionTitle: string;
  procuracyId: string;
  procuracyTitle: string;
  signer?: Signer[];
}
