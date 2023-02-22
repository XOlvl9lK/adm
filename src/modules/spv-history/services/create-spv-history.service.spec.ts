import { TestHelpers } from '@common/test/testHelpers';
import { CreateSpvHistoryService } from '@modules/spv-history/services/create-spv-history.service';
import { Test } from '@nestjs/testing';
import { spvHistoryMock } from '@modules/spv-history/infrastructure/spv-history.elastic-repo.spec';

const helpers = new TestHelpers().getHelpers();

describe('CreateSpvHistoryService', () => {
  let createSpvHistoryService: CreateSpvHistoryService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CreateSpvHistoryService, helpers.kafkaServiceMockProvider],
    }).compile();

    createSpvHistoryService = moduleRef.get<CreateSpvHistoryService>(CreateSpvHistoryService);
  });

  test('Should send message in topic journal-spv-history', async () => {
    await createSpvHistoryService.handle(spvHistoryMock);

    expect(helpers.kafkaServiceMock.send).toHaveBeenCalledTimes(1);
    expect(helpers.kafkaServiceMock.send).toHaveBeenCalledWith('journal-spv-history', {
      messages: [{ value: spvHistoryMock }],
    });
  });
});
