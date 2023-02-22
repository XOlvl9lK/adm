import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';
import { Injectable } from '@nestjs/common';
import { FindTypicalViolationDto } from '../controllers/dtos/find-typical-violation.dto';
import { TypicalViolationsElasticRepo } from '../infrastructure/typical-violations.elastic-repo';

@Injectable()
export class FindTypicalViolationService {
  constructor(private typicalViolationElasticRepo: TypicalViolationsElasticRepo) {}

  async findAll(dto: FindTypicalViolationDto) {
    const [items, total] = await this.typicalViolationElasticRepo.findAndCount(dto);
    const data = await this.typicalViolationElasticRepo.transformFindResponse(items);
    return { data, total };
  }

  async findByIds(ids: string[], sort?: Record<string, 'ASC' | 'DESC'>) {
    const items = await this.typicalViolationElasticRepo.getByIds(ids, sort);
    const data = await this.typicalViolationElasticRepo.transformFindResponse(items);
    return { data, total: data.length };
  }

  async findUniqueValues(props: GetFieldUniqueValues) {
    return await this.typicalViolationElasticRepo.getFieldUniqueValues(props);
  }
}
