import { ProcessingResultEnum } from '@modules/journal-loading-unloading/domain/processing-result.enum';
import { ElasticMock } from '@common/test/elastic.mock';
// eslint-disable-next-line max-len
import { JournalLoadingUnloadingElasticRepo } from '@modules/journal-loading-unloading/infrastructure/journal-loading-unloading.elastic-repo';
import { Test } from '@nestjs/testing';

export const journalLoadingUnloadingMock = {
  fileTitle: 'elit aute',
  allCardsNumber: 177,
  importDate: '2021-11-11T03:06:30-04:00',
  exportDate: '2006-10-22T08:40:50-05:00',
  processingResultTitle: ProcessingResultEnum.ERRORS_PRESENT,
  downloadedCardsNumber: 104,
  errorProcessedCardsNumber: 136,
};

export const findJournalLoadingUnloadingDtoMock = {
  page: 1,
  pageSize: 10,
  fileTitle: 'elit aute',
  processingResult: [ProcessingResultEnum.ERRORS_PRESENT],
};

const mockQuery = {
  bool: {
    must: [
      {
        match: {
          fileTitle: { query: 'elit aute' },
        },
      },
    ],
    filter: [
      {
        terms: { processingResultTitle: [ProcessingResultEnum.ERRORS_PRESENT] },
      },
    ],
  },
};

const { elasticMockProvider, helpers } = new ElasticMock()
  .addSearch(journalLoadingUnloadingMock)
  .addCount()
  .addMget(journalLoadingUnloadingMock)
  .build();

describe('JournalLoadingUnloadingElasticRepo', () => {
  let journalLoadingUnloadingElasticRepo: JournalLoadingUnloadingElasticRepo;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JournalLoadingUnloadingElasticRepo, elasticMockProvider],
    }).compile();

    journalLoadingUnloadingElasticRepo = moduleRef.get<JournalLoadingUnloadingElasticRepo>(
      JournalLoadingUnloadingElasticRepo,
    );
  });

  test('Repo should be defined', () => {
    expect(journalLoadingUnloadingElasticRepo).toBeDefined();
  });

  test('Should return journalLoadingUnloading', async () => {
    const result = await journalLoadingUnloadingElasticRepo.findAll(findJournalLoadingUnloadingDtoMock);

    expect(result).toEqual(helpers.getSearchResult(journalLoadingUnloadingMock));
  });

  test('Should get correct query', () => {
    const query = journalLoadingUnloadingElasticRepo['getQuery'](findJournalLoadingUnloadingDtoMock);

    expect(query).toEqual(mockQuery);
  });
});
