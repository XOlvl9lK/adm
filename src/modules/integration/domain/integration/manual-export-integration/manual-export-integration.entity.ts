import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { IntegrationDivisionEntity } from '../../integration-division/integration-division.entity';
import { FileFilter } from '../file-filter.interface';

export interface ManualExportIntegrationEntity {
  id: number;
  type: IntegrationTypeEnum.MANUAL_EXPORT;
  condition: ConditionTypeEnum;
  departmentId: number;
  departmentName: string;
  divisionId?: number;
  divisionName?: string;
  manualExportFilter?: FileFilter;
  divisions?: IntegrationDivisionEntity[];
  createDate: string;
  updateDate: string;
}
