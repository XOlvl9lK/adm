import { FormNumberEnum } from '@modules/journal-typical-violation/domain/form-number.enum';
import { EntityTypeTitleEnum } from '@modules/journal-typical-violation/domain/entity-type-title.enum';
import { OperationTypeTitleEnum } from '@modules/journal-typical-violation/domain/operation-type-title.enum';
import { ElasticMock } from '@common/test/elastic.mock';
// eslint-disable-next-line max-len
import { TypicalViolationsElasticRepo } from '@modules/journal-typical-violation/infrastructure/typical-violations.elastic-repo';
import { Test } from '@nestjs/testing';
import { TypicalViolationsEntity } from '@modules/journal-typical-violation/domain/typical-violations.entity';
import { ExaminationTypeEnum } from '../domain/examination-type.enum';

export const typicalViolationsMock = {
  versionDate: '2018-08-03T06:35:18-04:00',
  uniqueNumber: '62b2e885df27c80f99be15b2',
  formNumber: FormNumberEnum.FORM1,
  cardId: '62b2e885a09723076e917903',
  entityTypeTitle: EntityTypeTitleEnum.CRIMINAL_CASE,
  examinationTypeId: '62b2e885d7193d66eef9b17e',
  examinationTypeTitle: ExaminationTypeEnum.EXAMINATION_TYPE_1,
  operationTypeTitle: OperationTypeTitleEnum.CONCLUSION_FROM_VIOLATION,
  operationDate: '2013-01-11T02:57:31-04:00',
  userName: 'Wyatt',
  userPositionId: '62b2e8855482bb619dff07c8',
  divisionTitle: 'Подразделение 1',
  divisionId: 'Подразделение 1',
  regionTitle: 'Регион 2',
  regionId: 'Регион 2',
  departmentTitle: 'Ведомство 5',
  departmentId: 'Ведомство 5',
  comment: 'Deserunt irure',
  userPositionTitle: 'userPositionTitle',
  procuracyId: 'procuracyId',
  procuracyTitle: 'procuracyTitle',
} as TypicalViolationsEntity;

export const findTypicalViolationsDtoMock = {
  page: 1,
  pageSize: 10,
  userName: 'Wyatt',
  cardId: '62b2e885a09723076e917903',
  entityTypeTitle: [EntityTypeTitleEnum.CRIMINAL_CASE],
  operationTypeTitle: [OperationTypeTitleEnum.CONCLUSION_FROM_VIOLATION],
  userHasChangedDivisionTitles: false,
};

const mockQuery = {
  bool: {
    must: [
      {
        match: {
          userName: { query: 'Wyatt' },
        },
      },
      {
        match: {
          cardId: { query: '62b2e885a09723076e917903' },
        },
      },
    ],
    filter: [
      {
        terms: { entityTypeTitle: [EntityTypeTitleEnum.CRIMINAL_CASE] },
      },
      {
        terms: { operationTypeTitle: [OperationTypeTitleEnum.CONCLUSION_FROM_VIOLATION] },
      },
    ],
  },
};

const { elasticMockProvider, helpers } = new ElasticMock()
  .addSearch(typicalViolationsMock)
  .addCount()
  .addMget(typicalViolationsMock)
  .build();

describe('TypicalViolationsElasticRepo', () => {
  let typicalViolationsElasticRepo: TypicalViolationsElasticRepo;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TypicalViolationsElasticRepo, elasticMockProvider],
    }).compile();
    typicalViolationsElasticRepo = moduleRef.get<TypicalViolationsElasticRepo>(TypicalViolationsElasticRepo);
  });

  test('Repo should be defined', () => {
    expect(typicalViolationsElasticRepo).toBeDefined();
  });

  test('Should return typicalViolations', async () => {
    const result = await typicalViolationsElasticRepo.findAll(findTypicalViolationsDtoMock);

    expect(result).toEqual(helpers.getSearchResult(typicalViolationsMock));
  });

  test('Should get correct query', () => {
    const query = typicalViolationsElasticRepo['getQuery'](findTypicalViolationsDtoMock);

    expect(query).toEqual(mockQuery);
  });
});
