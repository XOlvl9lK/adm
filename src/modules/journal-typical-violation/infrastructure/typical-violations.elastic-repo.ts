import { ElasticRepoBase } from '@common/base/elastic-repo.base';
import { ElasticService } from '@modules/elastic/services/elastic.service';
import { Injectable } from '@nestjs/common';
import { TypicalViolationsEntity } from '../domain/typical-violations.entity';
import { FindTypicalViolationDto } from '../controllers/dtos/find-typical-violation.dto';
import { transformAuthorities } from '@common/utils/transformAuthorities';

@Injectable()
export class TypicalViolationsElasticRepo extends ElasticRepoBase<TypicalViolationsEntity> {
  constructor(elasticService: ElasticService) {
    super(elasticService.client, 'journal-typical-violation');
  }

  protected getQuery({
    departmentTitles,
    divisionTitles,
    regionTitles,
    cardId,
    versionDate,
    formNumber,
    entityTypeTitle,
    examinationTypeTitle,
    operationTypeTitle,
    operationDate,
    userName,
    procuracyTitles,
  }: FindTypicalViolationDto) {
    return {
      bool: {
        must: [...this.match('userName', userName), ...this.match('cardId', cardId)],
        filter: [
          ...this.terms('regionTitle', regionTitles),
          ...this.terms('departmentTitle', transformAuthorities(departmentTitles)),
          ...this.terms('divisionTitle', transformAuthorities(divisionTitles)),
          ...this.terms('procuracyTitle.keyword', transformAuthorities(procuracyTitles)),
          ...this.terms('examinationTypeTitle.keyword', examinationTypeTitle),
          ...this.terms('formNumber', formNumber),
          ...this.terms('entityTypeTitle', entityTypeTitle),
          ...this.terms('operationTypeTitle', operationTypeTitle),
          ...this.range('versionDate', versionDate?.[0], versionDate?.[1]),
          ...this.range('operationDate', operationDate?.[0], operationDate?.[1]),
        ],
      },
    };
  }
}
