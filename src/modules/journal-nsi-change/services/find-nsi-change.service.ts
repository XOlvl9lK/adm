import { GetFieldUniqueValues } from '@common/base/elastic-repo.base';
import { Injectable } from '@nestjs/common';
import { FindNsiChangeDto } from '../controllers/dto/find-nsi-change.dto';
import { NsiChangeElasticRepo } from '../infrastructure/nsi-change.elastic-repo';

@Injectable()
export class FindNsiChangeService {
  constructor(private nsiChangeElasticRepo: NsiChangeElasticRepo) {}

  async findAll(dto: FindNsiChangeDto) {
    const [items, total] = await this.nsiChangeElasticRepo.findAndCount(dto);
    const data = this.nsiChangeElasticRepo.transformFindResponse(items);
    return { data, total };
  }

  async findByIds(ids: string[], sort?: Record<string, 'ASC' | 'DESC'>) {
    const items = await this.nsiChangeElasticRepo.getByIds(ids, sort);
    const data = this.nsiChangeElasticRepo.transformFindResponse(items);
    return { data, total: data.length };
  }

  async findUniqueValues(props: GetFieldUniqueValues) {
    return await this.nsiChangeElasticRepo.getFieldUniqueValues(props);
  }
}
