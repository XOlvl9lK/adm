import { Injectable } from '@nestjs/common';
import { CancellationKuspElasticRepo } from '../infrastructure/cancellation-kusp.elastic-repo';
import { FindCancellationKuspDto } from '../controllers/dtos/find-cancellation-kusp.dto';
import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';

@Injectable()
export class FindCancellationKuspService {
  constructor(private cancellationKuspRepo: CancellationKuspElasticRepo) {}

  async findAll(dto: FindCancellationKuspDto) {
    const [items, total] = await this.cancellationKuspRepo.findAndCount(dto);
    const data = this.cancellationKuspRepo.transformFindResponse(items);
    return { data, total };
  }

  async findByIds(ids: string[], sort?: Record<string, 'ASC' | 'DESC'>) {
    const items = await this.cancellationKuspRepo.getByIds(ids, sort);
    const data = this.cancellationKuspRepo.transformFindResponse(items);
    return { data, total: data.length };
  }

  async findUniqueValues(props: GetFieldUniqueValues) {
    return await this.cancellationKuspRepo.getFieldUniqueValues(props);
  }
}
