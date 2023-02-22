import { Injectable } from '@nestjs/common';
import { ElasticRepoBase } from '@common/base/elastic-repo.base';
// eslint-disable-next-line max-len
import { JournalLoadingUnloadingEntity } from '@modules/journal-loading-unloading/domain/journal-loading-unloading.entity';
import { ElasticService } from '@modules/elastic/services/elastic.service';
// eslint-disable-next-line max-len
import {
  FindJournalLoadingUnloadingDto,
  ShowEnum,
} from '@modules/journal-loading-unloading/controllers/dtos/find-journal-loading-unloading.dto';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class JournalLoadingUnloadingElasticRepo extends ElasticRepoBase<JournalLoadingUnloadingEntity> {
  constructor(elasticService: ElasticService) {
    super(elasticService.client, 'journal-loading-unloading');
  }

  protected getQuery({ fileTitle, importDate, exportDate, processingResult, show }: FindJournalLoadingUnloadingDto) {
    return {
      bool: {
        must: [
          ...this.match('fileTitle', fileTitle),
          {
            bool: {
              should: [
                ...this.exists('importDate', (show || []).includes(ShowEnum.LOAD)),
                ...this.exists('exportDate', (show || []).includes(ShowEnum.UNLOAD)),
              ],
            },
          },
        ],
        filter: [
          {
            bool: {
              should: [
                ...this.range('exportDate', exportDate?.[0], exportDate?.[1]),
                ...this.range('importDate', importDate?.[0], importDate?.[1]),
              ],
            },
          },
          ...this.terms('processingResultTitle', processingResult),
        ],
      },
    };
  }
}
