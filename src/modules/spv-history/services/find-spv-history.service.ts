import { Injectable } from '@nestjs/common';
import { SpvHistoryElasticRepo } from '../infrastructure/spv-history.elastic-repo';

export interface FindSpvHistory {
  page?: number;
  pageSize?: number;
  dateFrom?: Date;
  dateTo?: Date;
  integrations?: number[];
  departmentName?: string[];
}

@Injectable()
export class FindSpvHistoryService {
  constructor(private spvHistoryRepository: SpvHistoryElasticRepo) {}

  async findAll(dto: FindSpvHistory) {
    const [items, total] = await this.spvHistoryRepository.findAndCount(dto);
    const data = await this.spvHistoryRepository.transformFindResponse(items);
    return { data, total };
  }

  async findByIds(ids: string[], sort?: Record<string, 'ASC' | 'DESC'>) {
    const items = await this.spvHistoryRepository.getByIds(ids, sort);
    const data = await this.spvHistoryRepository.transformFindResponse(items);
    return { data, total: data.length };
  }
}
