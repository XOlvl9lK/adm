import { FormNumberEnum } from '@modules/journal-cancellation-statistical-card/domain/form-number.enum';
import { OperationTypeEnum } from '@modules/journal-cancellation-statistical-card/domain/operation-type.enum';
import { ElasticMock } from '@common/test/elastic.mock';
// eslint-disable-next-line max-len
import { JournalCancellationStatisticalCardElasticRepo } from '@modules/journal-cancellation-statistical-card/infrastructure/journal-cancellation-statistical-card.elastic-repo';
import { Test } from '@nestjs/testing';
import clearAllMocks = jest.clearAllMocks;

export const journalCancellationStatisticalCardMock = {
  ikud: '62b2de17387e92b8c19bce2d',
  uniqueNumber: '62b2de1738a930bbf36df7e2',
  cardId: '62b2de177e8bb4cba5e09a6c',
  formNumber: FormNumberEnum.UD,
  operationDate: '2020-10-10T04:15:43.847+04:00',
  versionDate: '2010-12-30T14:26:22.847+04:00',
  operationTypeTitle: OperationTypeEnum.CANCELLATION,
  sourceTitle: 'elit',
  userLogin: 'Chavez',
  comment: 'Eiusmod id ad esse officia consectetur officia qui ad fugiat eiusmod esse minim aute mollit.',
  divisionTitle: 'Подразделение 1',
  divisionId: 'Подразделение 1',
  departmentTitle: 'Ведомство 1',
  departmentId: 'Ведомство 1',
  regionTitle: 'Регион 1',
  regionId: 'Регион 1',
  procuracyTitle: 'Прокуратура 1',
  procuracyId: 'Прокуратура 1',
};

export const findJournalCancellationStatisticalCardDtoMock = {
  page: 1,
  pageSize: 10,
  ikud: '62b2de17387e92b8c19bce2d',
  formNumber: [FormNumberEnum.UD],
  regionTitles: ['Регион 1'],
  operationDate: ['2020-10-10T04:15:43.847+04:00', '2010-12-30T14:26:22.847+04:00'] as [string, string],
  userHasChangedDivisionTitles: false,
};

const mockQuery = {
  bool: {
    must: [
      {
        match: {
          ikud: { query: '62b2de17387e92b8c19bce2d' },
        },
      },
    ],
    filter: [
      {
        terms: { regionTitle: ['Регион 1'] },
      },
      {
        terms: { formNumber: [FormNumberEnum.UD] },
      },
      {
        range: {
          operationDate: {
            gte: '2020-10-10T04:15:43.847+04:00',
            lte: '2010-12-30T14:26:22.847+04:00',
          },
        },
      },
    ],
  },
};

const { elasticMockProvider, helpers } = new ElasticMock()
  .addSearch(journalCancellationStatisticalCardMock)
  .addCount()
  .addMget(journalCancellationStatisticalCardMock)
  .build();

describe('JournalCancellationStatisticalCardElasticRepo', () => {
  let journalCancellationStatisticalCardElasticRepo: JournalCancellationStatisticalCardElasticRepo;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JournalCancellationStatisticalCardElasticRepo, elasticMockProvider],
    }).compile();

    journalCancellationStatisticalCardElasticRepo = moduleRef.get<JournalCancellationStatisticalCardElasticRepo>(
      JournalCancellationStatisticalCardElasticRepo,
    );
  });

  test('Repo should be defined', () => {
    expect(journalCancellationStatisticalCardElasticRepo).toBeDefined();
  });

  test('Should return cancellationStatisticalCard', async () => {
    const result = await journalCancellationStatisticalCardElasticRepo.findAll(
      findJournalCancellationStatisticalCardDtoMock,
    );

    expect(result).toEqual(helpers.getSearchResult(journalCancellationStatisticalCardMock));
  });

  test('Should get correct query', () => {
    const query = journalCancellationStatisticalCardElasticRepo['getQuery'](
      findJournalCancellationStatisticalCardDtoMock,
    );

    expect(query).toEqual(mockQuery);
  });

  afterEach(() => {
    clearAllMocks();
  });
});
