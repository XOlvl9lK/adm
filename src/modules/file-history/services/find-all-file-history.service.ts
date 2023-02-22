import { SortQuery } from '@common/utils/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileHistoryStatusEnum } from '../domain/file-history-status.enum';
import { FileHistoryEntity } from '../domain/file-history.entity';

export interface FindAllFileHistory {
  page?: number;
  pageSize?: number;
  startDate?: [string, string];
  sort?: SortQuery;
  departmentName?: string[];
  status?: FileHistoryStatusEnum[];
}

@Injectable()
export class FindAllFileHistoryService {
  constructor(
    @InjectRepository(FileHistoryEntity)
    private fileHistoryRepo: Repository<FileHistoryEntity>,
  ) {}

  async handle({ page = 1, pageSize = 10, startDate, sort, departmentName, status }: FindAllFileHistory) {
    const qb = this.fileHistoryRepo
      .createQueryBuilder('fileHistory')
      .leftJoinAndSelect('fileHistory.integration', 'integration')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (departmentName?.length) {
      qb.andWhere('integration.departmentName IN (:...departmentName)', { departmentName });
    }
    if (startDate) {
      if (startDate[0])
        qb.andWhere(`fileHistory.startDate >= :start`, {
          start: new Date(startDate[0]).toISOString(),
        });
      if (startDate[1])
        qb.andWhere(`fileHistory.startDate <= :finish`, {
          finish: new Date(startDate[1]).toISOString(),
        });
    }
    if (status?.length) {
      qb.andWhere('fileHistory.status IN (:...status)', { status });
    }
    if (sort) {
      qb.orderBy(sort);
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }
}
