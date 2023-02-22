import { Injectable } from '@nestjs/common';
import { ElasticRepoBase } from '@common/base/elastic-repo.base';
// eslint-disable-next-line max-len
import { JournalCancellationStatisticalCardEntity } from '@modules/journal-cancellation-statistical-card/domain/journal-cancellation-statistical-card.entity';
import { ElasticService } from '@modules/elastic/services/elastic.service';
// eslint-disable-next-line max-len
import { FindJournalCancellationStatisticalCardDto } from '@modules/journal-cancellation-statistical-card/controllers/dtos/find-journal-cancellation-statistical-card.dto';
import { transformAuthorities } from '@common/utils/transformAuthorities';

@Injectable()
// eslint-disable-next-line max-len
export class JournalCancellationStatisticalCardElasticRepo extends ElasticRepoBase<JournalCancellationStatisticalCardEntity> {
  constructor(elasticService: ElasticService) {
    super(elasticService.client, 'journal-cancellation-statistical-card');
  }

  protected getQuery({
    cardId,
    departmentTitles,
    divisionTitles,
    ikud,
    regionTitles,
    procuracyTitles,
    operationDate,
    operationTypeTitle,
    formNumber,
  }: FindJournalCancellationStatisticalCardDto) {
    return {
      bool: {
        must: [...this.match('ikud', ikud), ...this.match('cardId', cardId)],
        filter: [
          ...this.terms('divisionTitle', transformAuthorities(divisionTitles)),
          ...this.terms('departmentTitle', transformAuthorities(departmentTitles)),
          ...this.terms('regionTitle', regionTitles),
          ...this.terms('procuracyTitle', transformAuthorities(procuracyTitles)),
          ...this.terms('operationTypeTitle', operationTypeTitle),
          ...this.terms('formNumber', formNumber),
          ...this.range('operationDate', operationDate?.[0], operationDate?.[1]),
        ],
      },
    };
  }
}
