import { ElasticRepoBase } from '@common/base/elastic-repo.base';
import { JournalErrorsEntity } from '@modules/journal-errors/domain/journal-errors.entity';
import { ElasticService } from '@modules/elastic/services/elastic.service';
import { FindJournalErrorsDto } from '@modules/journal-errors/controllers/dtos/find-journal-errors.dto';
import { Injectable } from '@nestjs/common';
import { transformAuthorities } from '@common/utils/transformAuthorities';

@Injectable()
export class JournalErrorsElasticRepo extends ElasticRepoBase<JournalErrorsEntity> {
  constructor(elasticService: ElasticService) {
    super(elasticService.client, 'journal-errors');
  }

  protected getQuery({
    userLogin,
    ipAddress,
    divisionTitles,
    errorTypeTitle,
    regionTitles,
    siteSectionTitle,
    departmentTitles,
    eventDate,
  }: FindJournalErrorsDto) {
    return {
      bool: {
        must: [...this.match('userLogin', userLogin), ...this.match('ipAddress', ipAddress)],
        filter: [
          ...this.terms('divisionTitle', transformAuthorities(divisionTitles)),
          ...this.terms('regionTitle', regionTitles),
          ...this.terms('departmentTitle', transformAuthorities(departmentTitles)),
          ...this.terms('errorTypeTitle', errorTypeTitle),
          ...this.terms('siteSectionTitle', siteSectionTitle),
          ...this.range('eventDate', eventDate?.[0], eventDate?.[1]),
        ],
      },
    };
  }
}
