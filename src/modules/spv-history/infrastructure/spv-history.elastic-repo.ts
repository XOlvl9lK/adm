import { Injectable } from '@nestjs/common';
import { ElasticService } from '../../elastic/services/elastic.service';
import { ElasticRepoBase } from '@common/base/elastic-repo.base';
import { SpvHistoryEntity } from '../domain/spv-history.entity';
import { FindSpvHistoryDto } from '../controllers/dtos/find-spv-history.dto';

@Injectable()
export class SpvHistoryElasticRepo extends ElasticRepoBase<SpvHistoryEntity> {
  constructor(elasticService: ElasticService) {
    super(elasticService.client, 'journal-spv-history');
  }

  async getLastRequestNumber(): Promise<number> {
    const records = await this.client.search<SpvHistoryEntity>({
      index: this.index,
      body: {
        ...this.pagination(1, 1),
        ...this.sort({ requestNumber: 'DESC' }),
      },
    });
    const entities = records.hits.hits.map((hit) => hit._source);
    return entities.length && entities[0]?.requestNumber ? entities[0].requestNumber : 0;
  }

  protected getQuery({ startDate, departmentName, methodName, requestState }: FindSpvHistoryDto) {
    return {
      bool: {
        filter: [
          ...this.terms('requestMethod.name', methodName),
          ...this.terms('requestState', requestState),
          ...this.terms('integrationName', departmentName),
          ...this.range('startDate', startDate?.[0], startDate?.[1]),
        ],
      },
    };
  }
}
