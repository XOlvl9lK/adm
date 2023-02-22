import { TestHelpers } from '@common/test/testHelpers';
import {
  findUserEventsDtoMock,
  userEventsMock,
} from '@modules/journal-user-event/infrastructure/journal-user-events.elastic-repo.spec';
import { FindJournalUserEventsService } from '@modules/journal-user-event/services/find-journal-user-events.service';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { JournalUserEventsElasticRepo } from '@modules/journal-user-event/infrastructure/journal-user-events.elastic-repo';

const helpers = new TestHelpers().getHelpers();

const userEventsElasticRepoMock = helpers.getMockElasticRepo(userEventsMock);

describe('FindJournalUserEventsService', () => {
  let findJournalUserEventsService: FindJournalUserEventsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindJournalUserEventsService,
        {
          provide: JournalUserEventsElasticRepo,
          useValue: userEventsElasticRepoMock,
        },
      ],
    }).compile();

    findJournalUserEventsService = moduleRef.get<FindJournalUserEventsService>(FindJournalUserEventsService);
  });

  test('Service should be defined', () => {
    expect(findJournalUserEventsService).toBeDefined();
    expect(findJournalUserEventsService).toBeInstanceOf(FindJournalUserEventsService);
  });

  test('Should return userEvents transformed', async () => {
    const response = await findJournalUserEventsService.findAll(findUserEventsDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(userEventsMock));
  });

  test('Should return userEvents by ids transformed', async () => {
    const response = await findJournalUserEventsService.findByIds(helpers.random.ids);

    expect(response).toEqual(helpers.getTransformedResponse(userEventsMock));
  });
});
