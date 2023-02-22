import { ElasticRepoBase } from '@common/base/elastic-repo.base';
import { ElasticService } from '@modules/elastic/services/elastic.service';
import { Injectable } from '@nestjs/common';
import { FindFileHistoryDto } from '../controllers/dtos/find-file-history.dto';
import { FileHistoryEntity } from '../domain/file-history.entity';

@Injectable()
export class FileHistoryElasticRepo extends ElasticRepoBase<FileHistoryEntity> {
  constructor(elasticService: ElasticService) {
    super(elasticService.client, 'journal-file-history');
  }

  async getLastRequestDate(departmentTitle: string, divisionTitle?: string) {
    const query = {
      bool: {
        must: [
          ...this.match('departmentTitle', departmentTitle),
          ...(divisionTitle ? this.match('divisionTitle', divisionTitle) : []),
        ],
      },
    };
    const records = await this.client.search<FileHistoryEntity>({
      index: this.index,
      body: {
        ...this.pagination(1, 1),
        ...this.sort({ startDate: 'DESC' }),
        query,
      },
    });
    const entity = records.hits.hits.map((hit) => hit._source)[0] || null;
    return entity?.startDate;
  }

  protected getQuery({ departmentName, startDate }: FindFileHistoryDto) {
    return {
      bool: {
        filter: [
          ...this.terms('departmentTitle', departmentName),
          ...this.range('startDate', startDate?.[0], startDate?.[1]),
        ],
      },
    };
  }
}
