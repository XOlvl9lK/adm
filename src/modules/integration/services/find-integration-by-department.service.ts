import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationEntity } from '../domain/integration/integration.entity';
import { IntegrationRepository } from '../infrastructure/integration.repository';

export class FindIntegrationByDepartmentService {
  constructor(
    @InjectRepository(IntegrationRepository)
    private integrationRepo: Repository<IntegrationEntity>,
  ) {}

  async handle(departmentName: string) {
    return await this.integrationRepo.findOne({
      where: {
        departmentName,
      },
    });
  }
}
