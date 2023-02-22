import { ElasticRepoBase } from '@common/base/elastic-repo.base';
import { ElasticService } from '@modules/elastic/services/elastic.service';
import { CancellationRecordCardEntity } from '../domain/cancellation-record-card.entity';
import { FindCancellationRecordCardDto } from '../controllers/dto/find-cancellation-record-card.dto';
import { Injectable } from '@nestjs/common';
import { transformAuthorities } from '@common/utils/transformAuthorities';

@Injectable()
export class CancellationRecordCardElasticRepo extends ElasticRepoBase<CancellationRecordCardEntity> {
  constructor(elasticService: ElasticService) {
    super(elasticService.client, 'journal-cancellation-record-card');
  }

  protected getQuery({
    departmentTitles,
    divisionTitles,
    regionTitles,
    formNumber,
    uniqueNumber,
    operationTypeTitle,
    operationDate,
    responseMeasureTitles,
  }: FindCancellationRecordCardDto) {
    return {
      bool: {
        must: [...this.match('uniqueNumber', uniqueNumber)],
        filter: [
          ...this.terms('departmentTitle', transformAuthorities(departmentTitles)),
          ...this.terms('regionTitle', regionTitles),
          ...this.terms('divisionTitle', transformAuthorities(divisionTitles)),
          ...this.terms('responseMeasureTitle', transformAuthorities(responseMeasureTitles)),
          ...this.terms('operationTypeTitle', operationTypeTitle),
          ...this.terms('formNumber', formNumber),
          ...this.range('operationDate', operationDate?.[0], operationDate?.[1]),
        ],
      },
    };
  }
}
