import { TestHelpers } from '@common/test/testHelpers';
import {
  findJournalCancellationStatisticalCardDtoMock,
  journalCancellationStatisticalCardMock,
  // eslint-disable-next-line max-len
} from '@modules/journal-cancellation-statistical-card/infrastructure/journal-cancellation-statistical-card.elastic-repo.spec';
// eslint-disable-next-line max-len
import { FindJournalCancellationStatisticalCardService } from '@modules/journal-cancellation-statistical-card/services/find-journal-cancellation-statistical-card.service';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { JournalCancellationStatisticalCardElasticRepo } from '@modules/journal-cancellation-statistical-card/infrastructure/journal-cancellation-statistical-card.elastic-repo';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelpers().getHelpers();

const journalCancellationStatisticalCardElasticRepoMock = helpers.getMockElasticRepo(
  journalCancellationStatisticalCardMock,
);

describe('FindJournalCancellationStatisticalCardService', () => {
  let findJournalCancellationStatisticalCardService: FindJournalCancellationStatisticalCardService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindJournalCancellationStatisticalCardService,
        {
          provide: JournalCancellationStatisticalCardElasticRepo,
          useValue: journalCancellationStatisticalCardElasticRepoMock,
        },
      ],
    }).compile();

    findJournalCancellationStatisticalCardService = moduleRef.get<FindJournalCancellationStatisticalCardService>(
      FindJournalCancellationStatisticalCardService,
    );
  });

  test('Service should be defined', () => {
    expect(findJournalCancellationStatisticalCardService).toBeDefined();
  });

  test('Should return cancellationStatisticalCard transformed', async () => {
    const response = await findJournalCancellationStatisticalCardService.findAll(
      findJournalCancellationStatisticalCardDtoMock,
    );

    expect(response).toEqual(helpers.getTransformedResponse(journalCancellationStatisticalCardMock));
  });

  test('Should return cancellationStatisticalCard by ids transformed', async () => {
    const response = await findJournalCancellationStatisticalCardService.findByIds(helpers.random.ids);

    expect(response).toEqual(helpers.getTransformedResponse(journalCancellationStatisticalCardMock));
  });

  afterEach(() => {
    clearAllMocks();
  });
});
