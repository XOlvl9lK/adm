import { applyTimezoneToDate, getUserTimezone } from '@common/utils/getClientDateAndTime';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { IntegrationDivisionEntity } from '../domain/integration-division/integration-division.entity';
import { ExternalIntegrationEntity } from '../domain/integration/external-integration/external-integration.entity';
import { IntegrationEntity } from '../domain/integration/integration.entity';
import { IntegrationException } from '../infrastructure/integration.exception';
import { IntegrationRepository } from '../infrastructure/integration.repository';
import { initialFileFilter } from '../domain/integration/file-filter.interface';

export type CreateExternalIntegration = Omit<
  ExternalIntegrationEntity,
  'id' | 'createDate' | 'updateDate' | 'divisions'
> & {
  userTimezone?: string;
  divisions?: Omit<IntegrationDivisionEntity, 'id' | 'integration' | 'createDate' | 'updateDate'>[];
};

@Injectable()
export class CreateExternalIntegrationService {
  constructor(
    @InjectConnection()
    private connection: Connection,
    @InjectRepository(IntegrationRepository)
    private integrationRepository: IntegrationRepository,
  ) {}

  async handle({ divisions, userTimezone, ...other }: CreateExternalIntegration) {
    if (await this.integrationRepository.isExists({ ...other })) {
      throw IntegrationException.NameExists();
    }

    if (await this.integrationRepository.isMnemonicExists(other.smevMnemonic)) {
      throw IntegrationException.MnemonicExists();
    }

    return await this.connection.transaction(async (entityManager) => {
      const integration = entityManager.create(IntegrationEntity, {
        ...other,
        createDate: applyTimezoneToDate(new Date().toISOString(), getUserTimezone(userTimezone?.toString() || '0')),
        updateDate: applyTimezoneToDate(new Date().toISOString(), getUserTimezone(userTimezone?.toString() || '0')),
      });
      if (other.fileFilter?.unloadStatisticalReports && !other.fileFilter.onlyStatisticalReports?.length) {
        integration.fileFilter.onlyStatisticalReports = initialFileFilter.onlyStatisticalReports;
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
