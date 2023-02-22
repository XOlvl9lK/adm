import { ErrorTypeEnum } from '@modules/journal-errors/domain/error-type.enum';
import { ElasticMock } from '@common/test/elastic.mock';
import { JournalErrorsElasticRepo } from '@modules/journal-errors/infrastructure/journal-errors.elastic-repo';
import { Test } from '@nestjs/testing';
import clearAllMocks = jest.clearAllMocks;
import { SiteSectionEnum } from '@modules/journal-errors/domain/site-section.enum';

export const journalErrorsMock = {
  eventDate: '2022-09-09T00:54:17.847-06:00',
  ipAddress: '93.240.61.67',
  errorTypeTitle: ErrorTypeEnum.USER,
  userLogin: 'Todd',
  errorDescription: 'Veniam Lorem occaecat pariatur ea labore dolor officia.',
  divisionTitle: 'Подразделение 1',
  divisionId: 'Подразделение 1',
  departmentTitle: 'Ведомство 1',
  departmentId: 'Ведомство 1',
  regionTitle: 'Регион 1',
  regionId: 'Регион 1',
  siteSectionTitle: SiteSectionEnum.ADMINISTRATION_CANCELLATION,
};

export const findJournalErrorsDtoMock = {
  page: 1,
  pageSize: 10,
  ipAddress: '93.240.61.67',
  errorTypeTitle: [ErrorTypeEnum.USER],
  userLogin: 'Todd',
  divisionTitles: ['Подразделение 1'],
  regionTitles: ['Регион 1'],
  eventDate: ['2022-09-09T00:54:17.847-06:00', '2022-09-09T00:54:17.847-06:00'] as [string, string],
  userHasChangedDivisionTitles: false,
};

const mockQuery = {
  bool: {
    must: [
      {
        match: {
          userLogin: { query: 'Todd' },
        },
      },
      {
        match: {
          ipAddress: { query: '93.240.61.67' },
        },
      },
    ],
    filter: [
      {
        terms: { divisionTitle: ['Подразделение 1'] },
      },
      {
        terms: { regionTitle: ['Регион 1'] },
      },
      {
        terms: { errorTypeTitle: [ErrorTypeEnum.USER] },
      },
      {
        range: {
          eventDate: {
            gte: '2022-09-09T00:54:17.847-06:00',
            lte: '2022-09-09T00:54:17.847-06:00',
          },
        },
      },
    ],
  },
};

const { elasticMockProvider, helpers } = new ElasticMock()
  .addSearch(journalErrorsMock)
  .addCount()
  .addMget(journalErrorsMock)
  .build();

describe('JournalErrorsElasticRepo', () => {
  let journalErrorsElasticRepo: JournalErrorsElasticRepo;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JournalErrorsElasticRepo, elasticMockProvider],
    }).compile();

    journalErrorsElasticRepo = moduleRef.get<JournalErrorsElasticRepo>(JournalErrorsElasticRepo);
  });

  test('Repo should be defined', () => {
    expect(journalErrorsElasticRepo).toBeDefined();
  });

  test('Should return journalErrors', async () => {
    // const result = await journalErrorsElasticRepo.findAll(findJournalErrorsDtoMock);
    //
    // expect(result).toEqual(helpers.getSearchResult(journalErrorsMock));
  });

  test('Should get correct query', () => {
    const query = journalErrorsElasticRepo['getQuery'](findJournalErrorsDtoMock);

    expect(query).toEqual(mockQuery);
  });

  afterEach(() => {
    clearAllMocks();
  });
});
