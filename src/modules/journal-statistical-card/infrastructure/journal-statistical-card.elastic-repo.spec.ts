import { FormNumberEnum } from '@modules/journal-cancellation-statistical-card/domain/form-number.enum';
import { StatisticalCardSourceEnum } from '@modules/journal-statistical-card/domain/statistical-card-source.enum';
import { StatisticalCardStatusEnum } from '@modules/journal-statistical-card/domain/statistical-card-status.enum';
import { ElasticMock } from '@common/test/elastic.mock';
// eslint-disable-next-line max-len
import { JournalStatisticalCardElasticRepo } from '@modules/journal-statistical-card/infrastructure/journal-statistical-card.elastic-repo';
import { Test } from '@nestjs/testing';
import clearAllMocks = jest.clearAllMocks;
import { JournalStatisticalCardEntity } from '@modules/journal-statistical-card/domain/journal-statistical-card.entity';

export const journalStatisticalCardMock = {
  startProcessingDate: '2021-12-27T07:58:54-04:00',
  endProcessingDate: '2016-09-24T02:50:51-04:00',
  ikud: '62b2ee2e446159f89aec3183',
  formNumber: FormNumberEnum.GP2,
  cardId: '62b2ee2e8972d6b461d8db78',
  sourceTitle: StatisticalCardSourceEnum.SCD,
  operatorLogin: 'Moss',
  isProsecutorChange: true,
  divisionTitle: 'Подразделение 5',
  regionTitle: 'Регион 1',
  departmentTitle: 'Ведомство 2',
  signer: [
    {
      divisionTitle: 'duis reprehenderit',
      role: 'nulla sunt',
      fullName: 'Sanchez Chapman',
      position: 'aute incididunt',
      certificate: '62b2ee2e0a6d3346f88a5b6a',
      signDate: '2022-01-14T09:10:57-04:00',
    },
    {
      divisionTitle: 'ex culpa',
      role: 'incididunt nulla',
      fullName: 'Gilmore Kaufman',
      position: 'id occaecat',
      certificate: '62b2ee2e1ddad4863a7fa76e',
      signDate: '2012-05-07T02:38:05-04:00',
    },
    {
      divisionTitle: 'fugiat pariatur',
      role: 'consectetur eiusmod',
      fullName: 'Eva Mitchell',
      position: 'consequat esse',
      certificate: '62b2ee2ea5158c52e32496a2',
      signDate: '2020-09-12T10:21:12-04:00',
    },
    {
      divisionTitle: 'ut reprehenderit',
      role: 'Lorem id',
      fullName: 'Knox Walter',
      position: 'aliqua ea',
      certificate: '62b2ee2eb5866a8be8745c77',
      signDate: '2021-06-16T01:09:32-04:00',
    },
    {
      divisionTitle: 'aliqua proident',
      role: 'mollit non',
      fullName: 'Anita Miller',
      position: 'exercitation ea',
      certificate: '62b2ee2e4cd5f37bf7a24727',
      signDate: '2009-08-28T10:44:38-05:00',
    },
  ],
  status: [
    {
      date: '2013-02-12T03:27:34-04:00',
      title: StatisticalCardStatusEnum.ERROR,
      errorDescription: [
        {
          requisite: 'velit laboris',
          text: 'Exercitation proident deserunt aute Lorem do.',
        },
      ],
    },
    {
      date: '2007-09-07T03:22:44-05:00',
      title: StatisticalCardStatusEnum.ERROR,
      errorDescription: [
        {
          requisite: 'aliquip deserunt',
          text: 'Lorem veniam mollit cupidatat aliquip eiusmod excepteur ea pariatur irure.',
        },
      ],
    },
    {
      date: '2020-10-31T08:03:00-04:00',
      title: StatisticalCardStatusEnum.ERROR,
      errorDescription: [
        {
          requisite: 'nisi occaecat',
          text: 'Proident pariatur duis minim id enim sunt officia cillum elit nostrud.',
        },
      ],
    },
    {
      date: '2010-01-12T05:39:30-04:00',
      title: StatisticalCardStatusEnum.ERROR,
      errorDescription: [
        {
          requisite: 'ex excepteur',
          text: 'Ad veniam ea laboris veniam aliquip aute duis amet laboris aute.',
        },
      ],
    },
    {
      date: '2006-05-14T02:38:27-05:00',
      title: StatisticalCardStatusEnum.ERROR,
      errorDescription: [
        {
          requisite: 'occaecat minim',
          text: 'Elit Lorem sit excepteur ea deserunt occaecat tempor magna ad laborum in.',
        },
      ],
    },
  ],
} as JournalStatisticalCardEntity;

export const findJournalStatisticalCardDtoMock = {
  page: 1,
  pageSize: 10,
  cardId: '62b2ee2e8972d6b461d8db78',
  operatorLogin: 'Moss',
  sourceTitle: [StatisticalCardSourceEnum.SCD],
  userHasChangedDivisionTitles: false,
};

const mockQuery = {
  bool: {
    must: [
      {
        match: {
          cardId: { query: '62b2ee2e8972d6b461d8db78' },
        },
      },
      {
        match: {
          operatorLogin: { query: 'Moss' },
        },
      },
    ],
    filter: [
      {
        terms: { sourceTitle: [StatisticalCardSourceEnum.SCD] },
      },
    ],
    must_not: [],
  },
};

const { elasticMockProvider, helpers } = new ElasticMock()
  .addSearch(journalStatisticalCardMock)
  .addCount()
  .addMget(journalStatisticalCardMock)
  .build();

describe('JournalStatisticalCardElasticRepo', () => {
  let journalStatisticalCardElasticRepo: JournalStatisticalCardElasticRepo;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JournalStatisticalCardElasticRepo, elasticMockProvider],
    }).compile();

    journalStatisticalCardElasticRepo = moduleRef.get<JournalStatisticalCardElasticRepo>(
      JournalStatisticalCardElasticRepo,
    );
  });

  test('Repo should be defined', () => {
    expect(journalStatisticalCardElasticRepo).toBeDefined();
  });

  test('Should return statisticalCard', async () => {
    const result = await journalStatisticalCardElasticRepo.findAll(findJournalStatisticalCardDtoMock);

    expect(result).toEqual(helpers.getSearchResult(journalStatisticalCardMock));
  });

  test('Should get correct query', () => {
    const query = journalStatisticalCardElasticRepo['getQuery'](findJournalStatisticalCardDtoMock);

    expect(query).toEqual(mockQuery);
  });

  afterEach(() => {
    clearAllMocks();
  });
});
