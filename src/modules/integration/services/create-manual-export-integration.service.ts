import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { applyTimezoneToDate, getUserTimezone } from '@common/utils/getClientDateAndTime';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, Not } from 'typeorm';
import { IntegrationDivisionEntity } from '../domain/integration-division/integration-division.entity';
import { initialFileFilter } from '../domain/integration/file-filter.interface';
import { IntegrationEntity } from '../domain/integration/integration.entity';
// eslint-disable-next-line max-len
import { ManualExportIntegrationEntity } from '../domain/integration/manual-export-integration/manual-export-integration.entity';
import { IntegrationException } from '../infrastructure/integration.exception';

export type CreateManualExportIntegration = Omit<
  ManualExportIntegrationEntity,
  'id' | 'type' | 'divisions' | 'createDate' | 'updateDate'
> & {
  userTimezone?: string;
  divisions?: Omit<IntegrationDivisionEntity, 'id' | 'integration' | 'createDate' | 'updateDate'>[];
};

@Injectable()
export class CreateManualExportIntegrationService {
  constructor(
    @InjectConnection()
    private connection: Connection,
  ) {}

  async handle({ divisions, userTimezone, ...other }: CreateManualExportIntegration) {
    return await this.connection.transaction(async (entityManager) => {
      const exists = await entityManager.findOne(IntegrationEntity, {
        where: {
          departmentId: other.departmentId,
          type: IntegrationTypeEnum.MANUAL_EXPORT,
          condition: Not(ConditionTypeEnum.ARCHIVED),
        },
      });
      if (exists) throw IntegrationException.NameExists();
      const integration = entityManager.create(IntegrationEntity, {
        ...other,
        type: IntegrationTypeEnum.MANUAL_EXPORT,
        createDate: applyTimezoneToDate(new Date().toISOString(), getUserTimezone(userTimezone?.toString() || '0')),
        updateDate: applyTimezoneToDate(new Date().toISOString(), getUserTimezone(userTimezone?.toString() || '0')),
      });
      if (
        other.manualExportFilter?.unloadStatisticalReports &&
        !other.manualExportFilter?.onlyStatisticalReports.length
      ) {
        integration.manualExportFilter.onlyStatisticalReports = initialFileFilter.onlyStatisticalReports;
      }
      if (divisions && divisions.length) {
        integration.divisions = entityManager.create(
          IntegrationDivisionEntity,
          divisions.map((division) => ({
            ...division,
            createDate: applyTimezoneToDate(new Date().toISOString(), getUserTimezone(userTimezone?.toString() || '0')),
            updateDate: applyTimezoneToDate(new Date().toISOString(), getUserTimezone(userTimezone?.toString() || '0')),
          })),
        );
      }
      return await entityManager.save(integration);
    });
  }
}
