import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { applyTimezoneToDate, getUserTimezone } from '@common/utils/getClientDateAndTime';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, In, Not } from 'typeorm';
import { IntegrationDivisionEntity } from '../domain/integration-division/integration-division.entity';
import { initialFileFilter } from '../domain/integration/file-filter.interface';
import { IntegrationEntity } from '../domain/integration/integration.entity';
import { IntegrationException } from '../infrastructure/integration.exception';

export type UpdateIntegration = Partial<Omit<IntegrationEntity, 'id' | 'divisions' | 'createDate' | 'updateDate'>> & {
  id: number;
  userTimezone?: string;
  divisions?: (Omit<IntegrationDivisionEntity, 'id' | 'integration' | 'createDate' | 'updateDate'> & {
    id?: number;
  })[];
};
@Injectable()
export class UpdateIntegrationService {
  constructor(
    @InjectConnection()
    private connection: Connection,
  ) {}

  async handle({ id, divisions, userTimezone, ...payload }: UpdateIntegration) {
    return await this.connection.transaction(async (entityManager) => {
      const integration = await entityManager.findOne(IntegrationEntity, {
        where: { id },
        relations: ['divisions'],
      });
      if (!integration) throw IntegrationException.IntegrationNotExists();

      const condition = payload.condition ?? integration.condition;
      const { ACTIVE, INACTIVE } = ConditionTypeEnum;
      if ([ACTIVE, INACTIVE].includes(condition)) {
        const exists = await entityManager.findOne(IntegrationEntity, {
          where: {
            id: Not(id),
            condition: In([ACTIVE, INACTIVE]),
            type: payload.type ?? integration.type,
            departmentId: payload.departmentId ?? integration.departmentId,
          },
        });
        if (Boolean(exists)) throw IntegrationException.NameExists();
      }

      const updatedIntegration: IntegrationEntity = {
        ...integration,
        ...payload,
      };

      if (
        updatedIntegration.fileFilter?.unloadStatisticalReports &&
        !updatedIntegration.fileFilter?.onlyStatisticalReports?.length
      ) {
        updatedIntegration.fileFilter.onlyStatisticalReports = initialFileFilter.onlyStatisticalReports;
      }

      if (
        updatedIntegration.manualExportFilter?.unloadStatisticalReports &&
        !updatedIntegration.manualExportFilter?.onlyStatisticalReports?.length
      ) {
        updatedIntegration.manualExportFilter.onlyStatisticalReports = initialFileFilter.onlyStatisticalReports;
      }

      if (divisions && divisions.length) {
        const deletableDivisions = integration.divisions.filter((prev) => !divisions.find((i) => i.id === prev.id));
        if (deletableDivisions.length) await entityManager.delete(IntegrationDivisionEntity, deletableDivisions);
        const formattedDivisions = divisions.map((division) => {
          return {
            ...division,
            ...(!division.id && {
              createDate: applyTimezoneToDate(
                new Date().toISOString(),
                getUserTimezone(userTimezone?.toString() || '0'),
              ),
            }),
            updateDate: applyTimezoneToDate(new Date().toISOString(), getUserTimezone(userTimezone?.toString() || '0')),
          };
        });

        return await entityManager.save(IntegrationEntity, {
          ...updatedIntegration,
          divisions: entityManager.create(IntegrationDivisionEntity, formattedDivisions),
          updateDate: applyTimezoneToDate(new Date().toISOString(), getUserTimezone(userTimezone?.toString() || '0')),
        });
      } else {
        return await entityManager.save(IntegrationEntity, {
          ...updatedIntegration,
          updateDate: applyTimezoneToDate(new Date().toISOString(), getUserTimezone(userTimezone?.toString() || '0')),
        });
      }
    });
  }
}
