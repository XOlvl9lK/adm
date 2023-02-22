import { Injectable } from '@nestjs/common';
import { ElasticRepoBase, RepoOptions } from '@common/base/elastic-repo.base';
import { JournalStatisticalCardEntity } from '@modules/journal-statistical-card/domain/journal-statistical-card.entity';
import { ElasticService } from '@modules/elastic/services/elastic.service';
// eslint-disable-next-line max-len
import { FindJournalStatisticalCardDto } from '@modules/journal-statistical-card/controllers/dtos/find-journal-statistical-card.dto';
import { transformAuthorities } from '@common/utils/transformAuthorities';
import { PackageTypeEnum } from '@modules/journal-kusp/domain/package-type.enum';

const getSortSpecifiedField: RepoOptions['getSortSpecifiedField'] = (field, order) => {
  if (field === 'signer.role') {
    return ['_script', { type: 'string', script: "return doc['signer.role'].join('');", order }];
  }
};

@Injectable()
export class JournalStatisticalCardElasticRepo extends ElasticRepoBase<JournalStatisticalCardEntity> {
  constructor(elasticService: ElasticService) {
    super(elasticService.client, 'journal-statistical-card', { getSortSpecifiedField });
  }

  findById(id: string) {
    return this.client.get<JournalStatisticalCardEntity>({
      index: this.index,
      id,
    });
  }

  protected getQuery({
    cardType,
    cardId,
    isProsecutorChange,
    departmentTitles,
    divisionTitles,
    formNumber,
    ikud,
    operatorLogin,
    regionTitles,
    sourceTitle,
    statusTitle,
    statusDate,
    startProcessingDate,
    procuracyTitles,
  }: FindJournalStatisticalCardDto) {
    return {
      bool: {
        must: [
          ...this.match('ikud', ikud),
          ...this.match('cardId', cardId),
          ...this.match('operatorLogin', operatorLogin),
        ],
        filter: [
          ...this.terms('departmentTitle', transformAuthorities(departmentTitles)),
          ...this.terms('regionTitle', regionTitles),
          ...this.terms('divisionTitle', transformAuthorities(divisionTitles)),
          ...this.terms('procuracyTitle', transformAuthorities(procuracyTitles)),
          ...this.range('startProcessingDate', startProcessingDate?.[0], startProcessingDate?.[1]),
          ...(statusTitle
            ? [
                {
                  script: {
                    script: {
                      inline: "params['titles'].contains(doc['status.title'][doc['status.title'].length - 1])",
                      lang: 'painless',
                      params: {
                        titles: statusTitle,
                      },
                    },
                  },
                },
              ]
            : []),
          ...this.range('status.date', statusDate?.[0], statusDate?.[1]),
          ...this.terms('sourceTitle', sourceTitle),
          ...this.terms('formNumber', formNumber),
          ...this.terms('isProsecutorChange', isProsecutorChange),
          ...this.exists(
            'signer',
            Boolean(cardType?.includes(PackageTypeEnum.WITH_SIGNATURE) && cardType?.length === 1),
          ),
        ],
        must_not: [
          ...this.exists(
            'signer',
            Boolean(cardType?.includes(PackageTypeEnum.WITHOUT_SIGNATURE) && cardType?.length === 1),
          ),
        ],
      },
    };
  }
}
