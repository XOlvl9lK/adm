import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationEntity } from '../domain/integration/integration.entity';
import { IntegrationRepository } from '../infrastructure/integration.repository';

export interface FindUniqueDepartments {
  integrationType: IntegrationTypeEnum[];
}

export class FindUniqueDepartmentsService {
  constructor(
    @InjectRepository(IntegrationRepository)
    private integrationRepository: Repository<IntegrationEntity>,
  ) {}

  async handle({ integrationType }: FindUniqueDepartments) {
    return await this.integrationRepository
      .createQueryBuilder('integration')
      .select('DISTINCT integration.department_id as "departmentId", department_name as "departmentName"')
      .where('integration.type IN (:...integrationType)', { integrationType })
      .andWhere('integration.condition in (:...condition)', {
        condition: [ConditionTypeEnum.ACTIVE, ConditionTypeEnum.INACTIVE],
      })
      .getRawMany<{ departmentId: number; departmentName: string }>();
  }
}
