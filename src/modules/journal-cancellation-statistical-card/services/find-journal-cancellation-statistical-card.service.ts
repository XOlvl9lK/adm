import { Injectable } from '@nestjs/common';
// eslint-disable-next-line max-len
import { JournalCancellationStatisticalCardElasticRepo } from '@modules/journal-cancellation-statistical-card/infrastructure/journal-cancellation-statistical-card.elastic-repo';
// eslint-disable-next-line max-len
import { FindJournalCancellationStatisticalCardDto } from '@modules/journal-cancellation-statistical-card/controllers/dtos/find-journal-cancellation-statistical-card.dto';
import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';

@Injectable()
export class FindJournalCancellationStatisticalCardService {
  constructor(private journalCancellationStatisticalCardElasticRepo: JournalCancellationStatisticalCardElasticRepo) {}

  async findAll(dto: FindJournalCancellationStatisticalCardDto) {
    const [items, total] = await this.journalCancellationStatisticalCardElasticRepo.findAndCount(dto);
    const data = this.journalCancellationStatisticalCardElasticRepo.transformFindResponse(items);
    return { data, total };
  }

  async findByIds(ids: string[], sort?: Record<string, 'ASC' | 'DESC'>) {
    const items = await this.journalCancellationStatisticalCardElasticRepo.getByIds(ids, sort);
    const data = this.journalCancellationStatisticalCardElasticRepo.transformFindResponse(items);
    return { data, total: data.length };
  }

  async findUniqueValues(props: GetFieldUniqueValues) {
    return await this.journalCancellationStatisticalCardElasticRepo.getFieldUniqueValues(props);
  }
}
