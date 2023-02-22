import { Injectable } from '@nestjs/common';
import { CancellationRecordCardElasticRepo } from '../infrastructure/cancellation-record-card.elastic-repo';
import { FindCancellationRecordCardDto } from '../controllers/dto/find-cancellation-record-card.dto';
import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';

@Injectable()
export class FindCancellationRecordCardService {
  constructor(private cancellationRecordCardRepo: CancellationRecordCardElasticRepo) {}

  async findAll(dto: FindCancellationRecordCardDto) {
    const [items, total] = await this.cancellationRecordCardRepo.findAndCount(dto);
    const data = this.cancellationRecordCardRepo.transformFindResponse(items);
    return { data, total };
  }

  async findByIds(ids: string[], sort?: Record<string, 'ASC' | 'DESC'>) {
    const items = await this.cancellationRecordCardRepo.getByIds(ids, sort);
    const data = this.cancellationRecordCardRepo.transformFindResponse(items);
    return { data, total: data.length };
  }

  async findUniqueValues(props: GetFieldUniqueValues) {
    return await this.cancellationRecordCardRepo.getFieldUniqueValues(props);
  }
}
