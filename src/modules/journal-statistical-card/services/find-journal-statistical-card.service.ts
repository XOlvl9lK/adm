import { Injectable } from '@nestjs/common';
// eslint-disable-next-line max-len
import { JournalStatisticalCardElasticRepo } from '@modules/journal-statistical-card/infrastructure/journal-statistical-card.elastic-repo';
// eslint-disable-next-line max-len
import { FindJournalStatisticalCardDto } from '@modules/journal-statistical-card/controllers/dtos/find-journal-statistical-card.dto';
import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';

@Injectable()
export class FindJournalStatisticalCardService {
  constructor(private journalStatisticalCardElasticRepo: JournalStatisticalCardElasticRepo) {}

  async findAll(dto: FindJournalStatisticalCardDto) {
    const [items, total] = await this.journalStatisticalCardElasticRepo.findAndCount(dto);
    const data = await this.journalStatisticalCardElasticRepo.transformFindResponse(items);
    return { data, total };
  }

  async findByIds(ids: string[], sort?: Record<string, 'ASC' | 'DESC'>) {
    const items = await this.journalStatisticalCardElasticRepo.getByIds(ids, sort);
    const data = await this.journalStatisticalCardElasticRepo.transformFindResponse(items);
    return { data, total: data.length };
  }

  async findUniqueValues(props: GetFieldUniqueValues) {
    return await this.journalStatisticalCardElasticRepo.getFieldUniqueValues(props);
  }
}
