import { Injectable } from '@nestjs/common';
import { ElasticRepoBase, RepoOptions } from '@common/base/elastic-repo.base';
import { JournalKuspEntity } from '@modules/journal-kusp/domain/journal-kusp.entity';
import { ElasticService } from '@modules/elastic/services/elastic.service';
import { FindJournalKuspDto } from '@modules/journal-kusp/controllers/dtos/find-journal-kusp.dto';
import { PackageTypeEnum } from '@modules/journal-kusp/domain/package-type.enum';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { transformAuthorities } from '@common/utils/transformAuthorities';

const getSortSpecifiedField: RepoOptions['getSortSpecifiedField'] = (field, order) => {
  if (field === 'signer.role') {
    return ['_script', { type: 'string', script: "return doc['signer.role'].join('');", order }];
  }
};

@Injectable()
export class JournalKuspElasticRepo extends ElasticRepoBase<JournalKuspEntity> {
  constructor(elasticService: ElasticService) {
    super(elasticService.client, 'journal-kusp', { getSortSpecifiedField });
  }

  findById(id: string) {
    return this.client.get<JournalKuspEntity>({
      index: this.index,
      id,
    });
  }

  protected getQuery({
    kuspNumber,
    fileTitle,
    operatorLogin,
    signerName,
    packageTypes,
    sources,
    statuses,
    startProcessingDate,
    regionTitles,
    divisionTitles,
    departmentTitles,
  }: FindJournalKuspDto): QueryDslQueryContainer {
    return {
      bool: {
        must: [
          ...this.match('kuspNumber.number', kuspNumber),
          ...this.match('fileTitle', fileTitle),
          ...this.match('operatorLogin', operatorLogin),
          ...this.match('signer.fullName', signerName),
        ],
        filter: [
          ...this.terms('departmentTitle', transformAuthorities(departmentTitles)),
          ...this.terms('regionTitle', regionTitles),
          ...this.terms('divisionTitle', transformAuthorities(divisionTitles)),
          ...this.terms('sourceTitle', sources),
          ...this.terms('statusTitle', statuses),
          ...this.range('startProcessingDate', startProcessingDate?.[0], startProcessingDate?.[1]),
          ...this.exists(
            'signer',
            Boolean(packageTypes?.includes(PackageTypeEnum.WITH_SIGNATURE) && packageTypes?.length === 1),
          ),
        ],
        ...(packageTypes?.includes(PackageTypeEnum.WITHOUT_SIGNATURE) &&
          packageTypes?.length === 1 && {
            must_not: [
              ...this.exists(
                'signer',
                Boolean(packageTypes?.includes(PackageTypeEnum.WITHOUT_SIGNATURE) && packageTypes?.length === 1),
              ),
            ],
          }),
      },
    };
  }
}
