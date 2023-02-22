import { TestHelpers } from '@common/test/testHelpers';
import { spvHistoryMock } from '@modules/spv-history/infrastructure/spv-history.elastic-repo.spec';
import { GetLastSpvRequestNumber } from '@modules/spv-history/services/get-last-spv-request-number.service';
import { Test } from '@nestjs/testing';
import { SpvHistoryElasticRepo } from '@modules/spv-history/infrastructure/spv-history.elastic-repo';

const helpers = new TestHelpers().getHelpers();

const spvHistoryElasticRepoMock = helpers.getMockElasticRepo(spvHistoryMock);

describe('GetLastSpvRequestNumber', () => {
  let getLastSpvRequestNumber: GetLastSpvRequestNumber;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetLastSpvRequestNumber,
        {
          provide: SpvHistoryElasticRepo,
          useValue: {
            ...spvHistoryElasticRepoMock,
            getLastRequestNumber: jest.fn().mockResolvedValue(6),
          },
        },
      ],
    }).compile();

    getLastSpvRequestNumber = moduleRef.get<GetLastSpvRequestNumber>(GetLastSpvRequestNumber);
  });

  test('Service should be defined', () => {
    expect(getLastSpvRequestNumber).toBeDefined();
  });

  test('Should return last request number', async () => {
    const lastRequestNumber = await getLastSpvRequestNumber.handle();

    expect(lastRequestNumber).toEqual({
      lastRequestNumber: 6,
    });
  });
});
