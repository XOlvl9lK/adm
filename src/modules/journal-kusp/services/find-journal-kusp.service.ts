import { Injectable } from '@nestjs/common';
import { JournalKuspElasticRepo } from '@modules/journal-kusp/infrastructure/journal-kusp.elastic-repo';
import { FindJournalKuspDto } from '@modules/journal-kusp/controllers/dtos/find-journal-kusp.dto';
import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';

@Injectable()
export class FindJournalKuspService {
  constructor(private journalKuspElasticRepo: JournalKuspElasticRepo) {}

  async findAll(dto: FindJournalKuspDto) {
    const [items, total] = await this.journalKuspElasticRepo.findAndCount(dto);
    const data = this.journalKuspElasticRepo.transformFindResponse(items);
    return { data, total };
  }

  async findByIds(ids: string[], sort?: Record<string, 'ASC' | 'DESC'>) {
    const items = await this.journalKuspElasticRepo.getByIds(ids, sort);
    const data = this.journalKuspElasticRepo.transformFindResponse(items);
    return { data, total: data.length };
  }

  async findUniqueValues(props: GetFieldUniqueValues) {
    return await this.journalKuspElasticRepo.getFieldUniqueValues(props);
  }
}
