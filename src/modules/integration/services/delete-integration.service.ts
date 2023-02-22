import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { applyTimezoneToDate, getUserTimezone } from '@common/utils/getClientDateAndTime';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { IntegrationEntity } from '../domain/integration/integration.entity';

interface DeleteIntegration {
  id: number;
  userTimezone?: string;
}
@Injectable()
export class DeleteIntegrationService {
  constructor(
    @InjectConnection()
    private connection: Connection,
  ) {}

  async handle({ id, userTimezone }: DeleteIntegration) {
    await this.connection.transaction(async (entityManager) => {
      const integration = await entityManager.findOne(IntegrationEntity, id);
      if (integration) {
        integration.condition = ConditionTypeEnum.ARCHIVED;
        integration.updateDate = applyTimezoneToDate(
          new Date().toISOString(),
          getUserTimezone(userTimezone?.toString() || '0'),
        );
        await entityManager.save(IntegrationEntity, integration);
      }
    });
  }
}
