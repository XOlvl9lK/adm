import { UserEventResultTypeEnum } from '@modules/journal-user-event/domain/user-event-result-type.enum';
import { JournalUserEventsEntity } from '@modules/journal-user-event/domain/journal-user-events.entity';
import { FindUserEventDto } from '@modules/journal-user-event/controllers/dtos/find-user-event.dto';
import { ElasticMock } from '@common/test/elastic.mock';
// eslint-disable-next-line max-len
import { JournalUserEventsElasticRepo } from '@modules/journal-user-event/infrastructure/journal-user-events.elastic-repo';
import { Test } from '@nestjs/testing';

export const userEventsMock = {
  userLogin: 'Mcgowan',
  eventDate: '2022-06-22T08:48:26.613+03:00',
  url: '/addition',
  browserVersion: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  ipAddress: '177.154.72.233',
  resultTitle: UserEventResultTypeEnum.SUCCESS,
  queryParam: '?bedroom=animal',
  divisionTitle: 'Подразделение 1',
  divisionId: 'Подразделение 1',
  departmentTitle: 'Ведомство 1',
  departmentId: 'Ведомство 1',
  regionTitle: 'Регион 1',
  regionId: 'Регион 1',
} as JournalUserEventsEntity;

export const findUserEventsDtoMock = {
  page: 1,
  pageSize: 20,
  userLogin: 'Mcgowan',
  ipAddress: '177.154.72.233',
  browserVersion: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  result: [UserEventResultTypeEnum.SUCCESS],
} as FindUserEventDto;

const mockQuery = {
  bool: {
    must: [
      {
        match: {
          userLogin: { query: 'Mcgowan' },
        },
      },
      {
        match: {
          ipAddress: { query: '177.154.72.233' },
        },
      },
      {
        match: {
          browserVersion: { query: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        },
      },
    ],
    filter: [
      {
        terms: { resultTitle: [UserEventResultTypeEnum.SUCCESS] },
      },
    ],
  },
};

const { elasticMockProvider, helpers } = new ElasticMock()
  .addSearch(userEventsMock)
  .addCount()
  .addMget(userEventsMock)
  .build();

describe('JournalUserEventsElasticRepo', () => {
  let journalUserEventsElasticRepo: JournalUserEventsElasticRepo;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JournalUserEventsElasticRepo, elasticMockProvider],
    }).compile();

    journalUserEventsElasticRepo = moduleRef.get<JournalUserEventsElasticRepo>(JournalUserEventsElasticRepo);
  });

  test('Repo should bed defined', () => {
    expect(journalUserEventsElasticRepo).toBeDefined();
  });

  test('Should return userEvents', async () => {
    // const result = await journalUserEventsElasticRepo.findAll(findUserEventsDtoMock);
    //
    // expect(result).toEqual(helpers.getSearchResult(userEventsMock));
  });

  test('Should get correct query', () => {
    const query = journalUserEventsElasticRepo['getQuery'](findUserEventsDtoMock);

    expect(query).toEqual(mockQuery);
  });
});
