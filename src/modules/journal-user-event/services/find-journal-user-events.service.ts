import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';
import { Injectable } from '@nestjs/common';
import { FindUserEventDto } from '../controllers/dtos/find-user-event.dto';
import { JournalUserEventsElasticRepo } from '../infrastructure/journal-user-events.elastic-repo';

@Injectable()
export class FindJournalUserEventsService {
  constructor(private userEventElasticRepo: JournalUserEventsElasticRepo) {}

  async findAll(dto: FindUserEventDto) {
    const [items, total] = await this.userEventElasticRepo.findAndCount(dto);
    const data = this.userEventElasticRepo.transformFindResponse(items);
    return { data, total };
  }

  async findByIds(ids: string[], sort?: Record<string, 'ASC' | 'DESC'>) {
    const items = await this.userEventElasticRepo.getByIds(ids, sort);
    const data = this.userEventElasticRepo.transformFindResponse(items);
    return { data, total: data.length };
  }

  async findUniqueValues(props: GetFieldUniqueValues) {
    return await this.userEventElasticRepo.getFieldUniqueValues(props);
  }
}
