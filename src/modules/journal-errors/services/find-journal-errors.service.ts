import { Injectable } from '@nestjs/common';
import { JournalErrorsElasticRepo } from '@modules/journal-errors/infrastructure/journal-errors.elastic-repo';
import { FindJournalErrorsDto } from '@modules/journal-errors/controllers/dtos/find-journal-errors.dto';
import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';

@Injectable()
export class FindJournalErrorsService {
  constructor(private journalErrorsElasticRepo: JournalErrorsElasticRepo) {}

  async findAll(dto: FindJournalErrorsDto) {
    const [items, total] = await this.journalErrorsElasticRepo.findAndCount(dto);
    const data = this.journalErrorsElasticRepo.transformFindResponse(items);
    return { data, total };
  }

  async findByIds(ids: string[], sort?: Record<string, 'ASC' | 'DESC'>) {
    const items = await this.journalErrorsElasticRepo.getByIds(ids, sort);
    const data = this.journalErrorsElasticRepo.transformFindResponse(items);
    return { data, total: data.length };
  }

  async findUniqueValues(props: GetFieldUniqueValues) {
    return await this.journalErrorsElasticRepo.getFieldUniqueValues(props);
  }
}
