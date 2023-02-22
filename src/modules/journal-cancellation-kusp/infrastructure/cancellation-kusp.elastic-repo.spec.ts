// eslint-disable-next-line max-len
import { CancellationKuspElasticRepo } from '@modules/journal-cancellation-kusp/infrastructure/cancellation-kusp.elastic-repo';
import { Test } from '@nestjs/testing';
import { ElasticMock } from '@common/test/elastic.mock';
import clearAllMocks = jest.clearAllMocks;
import { OperationTypeTitleEnum } from '@modules/journal-cancellation-kusp/domain/operation-type-title.enum';

export const cancellationKuspMock = {
  kuspNumber: '62b2d91af2898f20a938b418',
  registrationDate: '2022-06-22T08:56:32.847+06:00',
  solutionTitle: 'solutionTitle',
  operationTypeTitle: OperationTypeTitleEnum.CANCELLATION,
  versionDate: '2022-06-22T08:56:32.847+02:00',
  operationDate: '2022-06-22T08:56:32.847+01:00',
  userLogin: 'Macdonald',
  comment: 'In minim deserunt incididunt proident cupidatat.',
  divisionTitle: 'Подразделение 1',
  divisionId: 'Подразделение 1',
  departmentTitle: 'Ведомство 1',
  departmentId: 'Ведомство 1',
  regionTitle: 'Регион 1',
  regionId: 'Регион 1',
  procuracyId: 'Прокуратура 1',
  procuracyTitle: 'Прокуратура 1',
  allPackageRecordsNumber: 5,
};

export const findCancellationKuspDtoMock = {
  page: 1,
  pageSize: 10,
  userLogin: 'Macdonald',
  kuspNumber: '62b2d91af2898f20a938b418',
  regionTitles: ['Регион 1'],
  operationTypeTitle: [OperationTypeTitleEnum.CANCELLATION],
  userHasChangedDivisionTitles: false,
};

const mockQuery = {
  bool: {
    must: [
      {
        match: {
          userLogin: { query: 'Macdonald' },
        },
      },
      {
        match: {
          kuspNumber: { query: '62b2d91af2898f20a938b418' },
        },
      },
    ],
    filter: [
      {
        terms: { regionTitle: ['Регион 1'] },
      },
      {
        terms: { operationTypeTitle: [OperationTypeTitleEnum.CANCELLATION] },
      },
    ],
  },
};

const { elasticMockProvider, helpers } = new ElasticMock()
  .addSearch(cancellationKuspMock)
  .addCount()
  .addMget(cancellationKuspMock)
  .build();

describe('CancellationKuspElasticRepo', () => {
  let cancellationKuspElasticRepo: CancellationKuspElasticRepo;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CancellationKuspElasticRepo, elasticMockProvider],
    }).compile();

    cancellationKuspElasticRepo = moduleRef.get<CancellationKuspElasticRepo>(CancellationKuspElasticRepo, {
      strict: false,
    });
  });

  test('Repo should be defined', () => {
    expect(cancellationKuspElasticRepo).toBeDefined();
  });

  test('Should return cancellationKusp', async () => {
    const result = await cancellationKuspElasticRepo.findAll(findCancellationKuspDtoMock);

    expect(result).toEqual(helpers.getSearchResult(cancellationKuspMock));
  });

  test('Should get correct query', () => {
    const query = cancellationKuspElasticRepo['getQuery'](findCancellationKuspDtoMock);

    expect(query).toEqual(mockQuery);
  });

  afterEach(() => {
    clearAllMocks();
  });
});
