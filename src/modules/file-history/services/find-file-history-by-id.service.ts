import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileHistoryEntity } from '../domain/file-history.entity';

@Injectable()
export class FindFileHistoryByIdService {
  constructor(
    @InjectRepository(FileHistoryEntity)
    private fileHistoryRepo: Repository<FileHistoryEntity>,
  ) {}

  async handle(ids?: number[], sort: Record<string, 'ASC' | 'DESC'> = {}) {
    if (!ids?.length) return { data: [], total: 0 };
    const [data, total] = await this.fileHistoryRepo
      .createQueryBuilder('fileHistory')
      .leftJoinAndSelect('fileHistory.integration', 'integration')
      .where('fileHistory.id IN (:...ids)', { ids })
      .orderBy(sort)
      .getManyAndCount();

    return { data, total };
  }
}
