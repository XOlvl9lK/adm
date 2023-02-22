import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { IntegrationDivisionEntity } from '../../integration-division/integration-division.entity';
import { SchedulerEntity } from '../../scheduler/scheduler.entity';
import { FileFilter } from '../file-filter.interface';
import { SpvSmevFilter } from '../spv-smev-filter.interface';

export interface ExternalIntegrationEntity {
  id: number;

  type: IntegrationTypeEnum.SPV | IntegrationTypeEnum.SMEV | IntegrationTypeEnum.FILE;

  condition: ConditionTypeEnum;

  departmentId: number;
  departmentName: string;

  divisionId?: number;
  divisionName?: string;

  login?: string;

  spvFilter?: SpvSmevFilter;
  spvExternalSystemId?: string;
  spvCert?: string;

  smevFilter?: SpvSmevFilter;
  smevMnemonic?: string;
  smevAuthorityCertificate?: string;

  fileFilter?: FileFilter;
  filePath?: string;
  fileSchedulerDpuKusp?: SchedulerEntity;
  fileCronDpuKusp?: string;
  fileSchedulerStatisticalReport?: SchedulerEntity;
  fileCronStatisticalReport?: string;
  divisions?: IntegrationDivisionEntity[];

  lastUsedDate?: string;

  createDate: string;
  updateDate: string;
}
