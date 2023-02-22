import { TestHelpers } from '@common/test/testHelpers';
import {
  findSpvHistoryDtoMock,
  spvHistoryMock,
} from '@modules/spv-history/infrastructure/spv-history.elastic-repo.spec';
import { FindSpvHistoryService } from '@modules/spv-history/services/find-spv-history.service';
import { Test } from '@nestjs/testing';
import { SpvHistoryElasticRepo } from '@modules/spv-history/infrastructure/spv-history.elastic-repo';

const helpers = new TestHelpers().getHelpers();

const spvHistoryElasticRepoMock = helpers.getMockElasticRepo(spvHistoryMock);

describe('FindSpvHistoryService', () => {
  let findSpvHistoryService: FindSpvHistoryService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindSpvHistoryService,
        {
          provide: SpvHistoryElasticRepo,
          useValue: spvHistoryElasticRepoMock,
        },
      ],
    }).compile();

    findSpvHistoryService = moduleRef.get<FindSpvHistoryService>(FindSpvHistoryService);
  });

  test('Service should be defined', () => {
    expect(findSpvHistoryService).toBeDefined();
  });

  test('Should return spvHistory transformed', async () => {
    const response = await findSpvHistoryService.findAll(findSpvHistoryDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(spvHistoryMock));
  });

  test('Should return spvHistory by ids transformed', async () => {
    const response = await findSpvHistoryService.findByIds(helpers.random.ids);

    expect(response).toEqual(helpers.getTransformedResponse(spvHistoryMock));
  });
});
