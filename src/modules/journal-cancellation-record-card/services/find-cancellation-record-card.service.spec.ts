import { TestHelpers } from '@common/test/testHelpers';
import {
  cancellationRecordCardMock,
  findCancellationRecordCardDtoMock,
} from '@modules/journal-cancellation-record-card/infrastructure/cancellation-record-card.elastic-repo.spec';
// eslint-disable-next-line max-len
import { FindCancellationRecordCardService } from '@modules/journal-cancellation-record-card/services/find-cancellation-record-card.service';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { CancellationRecordCardElasticRepo } from '@modules/journal-cancellation-record-card/infrastructure/cancellation-record-card.elastic-repo';
import clearAllMocks = jest.clearAllMocks;

const helpers = new TestHelpers().getHelpers();

const cancellationRecordCardElasticRepoMock = helpers.getMockElasticRepo(cancellationRecordCardMock);

describe('FindCancellationRecordCard', () => {
  let findCancellationRecordCardService: FindCancellationRecordCardService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindCancellationRecordCardService,
        {
          provide: CancellationRecordCardElasticRepo,
          useValue: cancellationRecordCardElasticRepoMock,
        },
      ],
    }).compile();

    findCancellationRecordCardService = moduleRef.get<FindCancellationRecordCardService>(
      FindCancellationRecordCardService,
    );
  });

  test('Service should be defined', () => {
    expect(findCancellationRecordCardService).toBeDefined();
  });

  test('Should return cancellationRecordCard transformed', async () => {
    const response = await findCancellationRecordCardService.findAll(findCancellationRecordCardDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(cancellationRecordCardMock));
  });

  test('Should return cancellationRecordCard by ids transformed', async () => {
    const response = await findCancellationRecordCardService.findByIds(helpers.random.ids);

    expect(response).toEqual(helpers.getTransformedResponse(cancellationRecordCardMock));
  });

  afterEach(() => {
    clearAllMocks();
  });
});
