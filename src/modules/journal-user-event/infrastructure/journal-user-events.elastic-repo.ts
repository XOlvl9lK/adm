import { Injectable } from '@nestjs/common';
import { ElasticService } from '../../elastic/services/elastic.service';
import { FindUserEventDto } from '../controllers/dtos/find-user-event.dto';
import { ElasticRepoBase } from '@common/base/elastic-repo.base';
import { JournalUserEventsEntity } from '../domain/journal-user-events.entity';
import { transformAuthorities } from '@common/utils/transformAuthorities';

@Injectable()
export class JournalUserEventsElasticRepo extends ElasticRepoBase<JournalUserEventsEntity> {
  constructor(elasticService: ElasticService) {
    super(elasticService.client, 'journal-user-events');
  }

  protected getQuery({
    userLogin,
    ipAddress,
    browserVersion,
    departmentTitles,
    divisionTitles,
    regionTitles,
    result,
    eventDate,
  }: FindUserEventDto) {
    return {
      bool: {
        must: [
          ...this.match('userLogin', userLogin),
          ...this.match('ipAddress', ipAddress),
          ...this.match('browserVersion', browserVersion),
        ],
        filter: [
          ...this.terms('departmentTitle', transformAuthorities(departmentTitles)),
          ...this.terms('divisionTitle', transformAuthorities(divisionTitles)),
          ...this.terms('regionTitle', regionTitles),
          ...this.terms('resultTitle', result),
          ...this.range('eventDate', eventDate?.[0], eventDate?.[1]),
        ],
      },
    };
  }
}
