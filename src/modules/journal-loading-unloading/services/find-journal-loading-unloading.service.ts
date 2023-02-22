import { Injectable } from '@nestjs/common';
// eslint-disable-next-line max-len
import { JournalLoadingUnloadingElasticRepo } from '@modules/journal-loading-unloading/infrastructure/journal-loading-unloading.elastic-repo';
// eslint-disable-next-line max-len
import { FindJournalLoadingUnloadingDto } from '@modules/journal-loading-unloading/controllers/dtos/find-journal-loading-unloading.dto';
import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';

@Injectable()
export class FindJournalLoadingUnloadingService {
  constructor(private journalLoadingUnloadingElasticRepo: JournalLoadingUnloadingElasticRepo) {}

  async findAll(dto: FindJournalLoadingUnloadingDto) {
    const [items, total] = await this.journalLoadingUnloadingElasticRepo.findAndCount(dto);
    const data = await this.journalLoadingUnloadingElasticRepo.transformFindResponse(items);
    return { data, total };
  }

  async findByIds(ids: string[], sort?: Record<string, 'ASC' | 'DESC'>) {
    const items = await this.journalLoadingUnloadingElasticRepo.getByIds(ids, sort);
    const data = await this.journalLoadingUnloadingElasticRepo.transformFindResponse(items);
    return { data, total: data.length };
  }

  async findUniqueValues(props: GetFieldUniqueValues) {
    return await this.journalLoadingUnloadingElasticRepo.getFieldUniqueValues(props);
  }
}
