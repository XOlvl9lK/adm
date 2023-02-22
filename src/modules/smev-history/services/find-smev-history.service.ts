import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindSmevHistoryDto } from '@modules/smev-history/controllers/dtos/find-smev-history.dto';
import { SmevHistoryRepository } from '@modules/smev-history/infrastructure/smev-history.repository';

@Injectable()
export class FindSmevHistoryService {
  constructor(
    @InjectRepository(SmevHistoryRepository)
    private smevHistoryRepo: SmevHistoryRepository,
  ) {}

  async findAll(dto: FindSmevHistoryDto) {
    const [data, total] = await this.smevHistoryRepo.findAll(dto);
    return { data, total };
  }

  async findByIds(ids: number[], sort?: FindSmevHistoryDto['sort']) {
    const data = await this.smevHistoryRepo.findIds(ids, sort);
    return { data, total: data.length };
  }
}
