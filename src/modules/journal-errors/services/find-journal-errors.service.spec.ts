import { TestHelpers } from '@common/test/testHelpers';
import {
  findJournalErrorsDtoMock,
  journalErrorsMock,
} from '@modules/journal-errors/infrastructure/journal-errors.elastic-repo.spec';
import { FindJournalErrorsService } from '@modules/journal-errors/services/find-journal-errors.service';
import { Test } from '@nestjs/testing';
import { JournalErrorsElasticRepo } from '@modules/journal-errors/infrastructure/journal-errors.elastic-repo';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelpers().getHelpers();

const journalErrorsElasticRepoMock = helpers.getMockElasticRepo(journalErrorsMock);

describe('FindJournalErrorsService', () => {
  let findJournalErrorsService: FindJournalErrorsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindJournalErrorsService,
        {
          provide: JournalErrorsElasticRepo,
          useValue: journalErrorsElasticRepoMock,
        },
      ],
    }).compile();

    findJournalErrorsService = moduleRef.get<FindJournalErrorsService>(FindJournalErrorsService);
  });

  test('Service should be defined', () => {
    expect(FindJournalErrorsService).toBeDefined();
  });

  test('Should return jorunalErrors transformed', async () => {
    const response = await findJournalErrorsService.findAll(findJournalErrorsDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(journalErrorsMock));
  });

  test('Should return journalErrors by ids transformed', async () => {
    const response = await findJournalErrorsService.findByIds(helpers.random.ids);

    expect(response).toEqual(helpers.getTransformedResponse(journalErrorsMock));
  });

  afterEach(() => {
    clearAllMocks();
  });
});
