import { ElasticRepoBase } from '@common/base/elastic-repo.base';
import { ElasticService } from '@modules/elastic/services/elastic.service';
import { Injectable } from '@nestjs/common';
import { CancellationKuspEntity } from '../domain/cancellation-kusp.entity';
// eslint-disable-next-line max-len
import { FindCancellationKuspDto } from '@modules/journal-cancellation-kusp/controllers/dtos/find-cancellation-kusp.dto';
import { transformAuthorities } from '@common/utils/transformAuthorities';

@Injectable()
export class CancellationKuspElasticRepo extends ElasticRepoBase<CancellationKuspEntity> {
  constructor(elasticService: ElasticService) {
    super(elasticService.client, 'journal-cancellation-kusp');
  }

  protected getQuery({
    departmentTitles,
    divisionTitles,
    regionTitles,
    procuracyTitles,
    operationDate,
    operationTypeTitle,
    kuspNumber,
    userLogin,
  }: FindCancellationKuspDto) {
    return {
      bool: {
        must: [...this.match('userLogin', userLogin), ...this.match('kuspNumber', kuspNumber)],
        filter: [
          ...this.terms('departmentTitle', transformAuthorities(departmentTitles)),
          ...this.terms('divisionTitle', transformAuthorities(divisionTitles)),
          ...this.terms('regionTitle', regionTitles),
          ...this.terms('procuracyTitle', transformAuthorities(procuracyTitles)),
          ...this.terms('operationTypeTitle', operationTypeTitle),
          ...this.range('operationDate', operationDate?.[0], operationDate?.[1]),
        ],
      },
    };
  }
}
