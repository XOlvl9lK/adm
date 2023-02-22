import { ElasticMock } from '@common/test/elastic.mock';
// eslint-disable-next-line max-len
import { CancellationRecordCardElasticRepo } from '@modules/journal-cancellation-record-card/infrastructure/cancellation-record-card.elastic-repo';
import { Test } from '@nestjs/testing';
import { FormNumberEnum } from '@modules/journal-cancellation-record-card/domain/form-number.enum';
import { OperationTypeTitleEnum } from '@modules/journal-cancellation-record-card/domain/operation-type-title.enum';
import clearAllMocks = jest.clearAllMocks;

export const cancellationRecordCardMock = {
  uniqueNumber: '62b2dc07890a99d06a9f5c7f',
  cardId: '62b2dc0717b626c1762adcdd',
  formNumber: FormNumberEnum.URP50,
  operationDate: '2010-07-31T10:49:25.847+04:00',
  operationTypeTitle: OperationTypeTitleEnum.CANCELLATION,
  userLogin: 'Melissa',
  comment: 'Ipsum ullamco eiusmod nulla consectetur minim consequat duis ad consectetur.',
  divisionId: 'Подразделение 1',
  divisionTitle: 'Подразделение 1',
  departmentId: 'Ведомство 1',
  departmentTitle: 'Ведомство 1',
  regionId: 'Регион 1',
  regionTitle: 'Регион 1',
  responseMeasureId: 'Мера реагирования 1',
  responseMeasureTitle: 'Мера реагирования 1',
};

export const findCancellationRecordCardDtoMock = {
  page: 1,
  pageSize: 10,
  uniqueNumber: '62b2dc07890a99d06a9f5c7f',
  formNumber: [FormNumberEnum.URP50],
  operationTypeTitle: [OperationTypeTitleEnum.CANCELLATION],
  userHasChangedDivisionTitles: false,
};

const { elasticMockProvider, helpers } = new ElasticMock()
  .addSearch(cancellationRecordCardMock)
  .addCount()
  .addMget(cancellationRecordCardMock)
  .build();

const mockQuery = {
  bool: {
    must: [
      {
        match: {
          uniqueNumber: { query: '62b2dc07890a99d06a9f5c7f' },
        },
      },
    ],
    filter: [
      {
        terms: { operationTypeTitle: [OperationTypeTitleEnum.CANCELLATION] },
      },
      {
        terms: { formNumber: [FormNumberEnum.URP50] },
      },
    ],
  },
};

describe('CancelltionRecordCardElasticRepo', () => {
  let cancellationRecordCardElasticRepo: CancellationRecordCardElasticRepo;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CancellationRecordCardElasticRepo, elasticMockProvider],
    }).compile();

    cancellationRecordCardElasticRepo = moduleRef.get<CancellationRecordCardElasticRepo>(
      CancellationRecordCardElasticRepo,
    );
  });

  test('Repo should be defined', () => {
    expect(cancellationRecordCardElasticRepo).toBeDefined();
  });

  test('Should return cancellationRecordCard', async () => {
    const result = await cancellationRecordCardElasticRepo.findAll(findCancellationRecordCardDtoMock);

    expect(result).toEqual(helpers.getSearchResult(cancellationRecordCardMock));
  });

  test('Should get correct query', () => {
    const query = cancellationRecordCardElasticRepo['getQuery'](findCancellationRecordCardDtoMock);

    expect(query).toEqual(mockQuery);
  });

  afterEach(() => {
    clearAllMocks();
  });
});
