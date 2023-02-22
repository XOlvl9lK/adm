import { TestHelpers } from '@common/test/testHelpers';
import {
  findJournalStatisticalCardDtoMock,
  journalStatisticalCardMock,
} from '@modules/journal-statistical-card/infrastructure/journal-statistical-card.elastic-repo.spec';
// eslint-disable-next-line max-len
import { FindJournalStatisticalCardService } from '@modules/journal-statistical-card/services/find-journal-statistical-card.service';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { JournalStatisticalCardElasticRepo } from '@modules/journal-statistical-card/infrastructure/journal-statistical-card.elastic-repo';

const helpers = new TestHelpers().getHelpers();

const journalStatisticalCardElasticRepoMock = helpers.getMockElasticRepo(journalStatisticalCardMock);

describe('FindJournalStatisticalCardService', () => {
  let findJournalStatisticalCardService: FindJournalStatisticalCardService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindJournalStatisticalCardService,
        {
          provide: JournalStatisticalCardElasticRepo,
          useValue: journalStatisticalCardElasticRepoMock,
        },
      ],
    }).compile();

    findJournalStatisticalCardService = moduleRef.get<FindJournalStatisticalCardService>(
      FindJournalStatisticalCardService,
    );
  });

  test('Service should be defined', () => {
    expect(findJournalStatisticalCardService).toBeDefined();
  });

  test('Should return statisticalCard transformed', async () => {
    const response = await findJournalStatisticalCardService.findAll(findJournalStatisticalCardDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(journalStatisticalCardMock));
  });

  test('Should return statisticalCard by ids transformed', async () => {
    const response = await findJournalStatisticalCardService.findByIds(helpers.random.ids);

    expect(response).toEqual(helpers.getTransformedResponse(journalStatisticalCardMock));
  });
});
