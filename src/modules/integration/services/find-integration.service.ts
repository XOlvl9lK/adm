import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationEntity } from '../domain/integration/integration.entity';
import { IntegrationRepository } from '../infrastructure/integration.repository';

@Injectable()
export class FindIntegrationService {
  constructor(
    @InjectRepository(IntegrationRepository)
    private integrationRepo: Repository<IntegrationEntity>,
  ) {}

  async handle(id: number) {
    return await this.integrationRepo.findOne(id, { relations: ['divisions'] });
  }
}
