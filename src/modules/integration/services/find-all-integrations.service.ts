import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { IntegrationEntity } from '../domain/integration/integration.entity';
import { IntegrationRepository } from '../infrastructure/integration.repository';

interface FindAllIntegrations {
  type: IntegrationTypeEnum | IntegrationTypeEnum[];
  page?: number;
  pageSize?: number;
  sort?: Record<string, 'ASC' | 'DESC'>;
}

@Injectable()
export class FindAllIntegrationsService {
  constructor(
    @InjectRepository(IntegrationRepository)
    private integrationRepo: Repository<IntegrationEntity>,
  ) {}

  async handle({ page = 1, pageSize = 10, sort, type }: FindAllIntegrations) {
    const [data, total] = await this.integrationRepo.findAndCount({
      where: {
        type: Array.isArray(type) ? In(type) : type,
        condition: Not(ConditionTypeEnum.ARCHIVED),
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      relations: ['divisions'],
      order: sort && Object.keys(sort).length ? sort : { createDate: 'DESC' },
    });
    return { total, data };
  }
}
