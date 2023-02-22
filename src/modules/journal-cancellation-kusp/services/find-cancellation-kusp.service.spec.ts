// eslint-disable-next-line max-len
import { FindCancellationKuspService } from '@modules/journal-cancellation-kusp/services/find-cancellation-kusp.service';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { CancellationKuspElasticRepo } from '@modules/journal-cancellation-kusp/infrastructure/cancellation-kusp.elastic-repo';
import {
  cancellationKuspMock,
  findCancellationKuspDtoMock,
} from '@modules/journal-cancellation-kusp/infrastructure/cancellation-kusp.elastic-repo.spec';
import clearAllMocks = jest.clearAllMocks;
import { TestHelpers } from '@common/test/testHelpers';

const helpers = new TestHelpers().getHelpers();

const cancellationKuspRepoMock = helpers.getMockElasticRepo(cancellationKuspMock);

describe('FindCancellationKuspService', () => {
  let findCancellationKuspService: FindCancellationKuspService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindCancellationKuspService,
        {
          provide: CancellationKuspElasticRepo,
          useValue: cancellationKuspRepoMock,
        },
      ],
    }).compile();

    findCancellationKuspService = moduleRef.get<FindCancellationKuspService>(FindCancellationKuspService);
  });

  test('Service should be defined', () => {
    expect(findCancellationKuspService).toBeDefined();
  });

  test('Should return cancellationKusp transformed', async () => {
    const response = await findCancellationKuspService.findAll(findCancellationKuspDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(cancellationKuspMock));
  });

  test('Should return cancellationKusp by ids transformed', async () => {
    const response = await findCancellationKuspService.findByIds(helpers.random.ids);

    expect(response).toEqual(helpers.getTransformedResponse(cancellationKuspMock));
  });

  afterEach(() => {
    clearAllMocks();
  });
});
