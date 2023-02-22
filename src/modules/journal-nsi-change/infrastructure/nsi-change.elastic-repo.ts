import { ElasticRepoBase } from '@common/base/elastic-repo.base';
import { ElasticService } from '@modules/elastic/services/elastic.service';
import { Injectable } from '@nestjs/common';
import { FindNsiChangeDto } from '../controllers/dto/find-nsi-change.dto';
import { NsiChangeEntity } from '../domain/nsi-change.entity';

@Injectable()
export class NsiChangeElasticRepo extends ElasticRepoBase<NsiChangeEntity> {
  constructor(elasticService: ElasticService) {
    super(elasticService.client, 'journal-nsi-change');
  }

  protected getQuery({ userName, ipAddress, objectTitle, eventTitle, eventDate }: FindNsiChangeDto) {
    return {
      bool: {
        must: [...this.match('userName', userName), ...this.match('ipAddress', ipAddress)],
        filter: [
          ...this.range('eventDate', eventDate?.[0], eventDate?.[1]),
          ...this.terms('objectTitle', objectTitle),
          ...this.terms('eventTitle', eventTitle),
        ],
      },
    };
  }
}
