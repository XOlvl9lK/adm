import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationCommonSettingEntity } from '../domain/integration-common-setting.entity';

@Injectable()
export class GetIntegrationCommonSettingService {
  constructor(
    @InjectRepository(IntegrationCommonSettingEntity)
    private commonSettingRepository: Repository<IntegrationCommonSettingEntity>,
  ) {}

  async handle() {
    return await this.commonSettingRepository.find({
      order: { key: 'ASC' },
    });
  }
}
