import { TestHelpers } from '@common/test/testHelpers';
import {
  findJournalLoadingUnloadingDtoMock,
  journalLoadingUnloadingMock,
} from '@modules/journal-loading-unloading/infrastructure/journal-loading-unloading.elastic-repo.spec';
// eslint-disable-next-line max-len
import { FindJournalLoadingUnloadingService } from '@modules/journal-loading-unloading/services/find-journal-loading-unloading.service';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { JournalLoadingUnloadingElasticRepo } from '@modules/journal-loading-unloading/infrastructure/journal-loading-unloading.elastic-repo';

const helpers = new TestHelpers().getHelpers();

const journalLoadingUnloadingElasticRepoMock = helpers.getMockElasticRepo(journalLoadingUnloadingMock);

describe('FindJournalLoadingUnloadingService', () => {
  let findJournalLoadingUnloadingService: FindJournalLoadingUnloadingService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindJournalLoadingUnloadingService,
        {
          provide: JournalLoadingUnloadingElasticRepo,
          useValue: journalLoadingUnloadingElasticRepoMock,
        },
      ],
    }).compile();

    findJournalLoadingUnloadingService = moduleRef.get<FindJournalLoadingUnloadingService>(
      FindJournalLoadingUnloadingService,
    );
  });

  test('Service should be defined', () => {
    expect(findJournalLoadingUnloadingService).toBeDefined();
  });

  test('Should return journalLoadingUnloading transformed', async () => {
    const response = await findJournalLoadingUnloadingService.findAll(findJournalLoadingUnloadingDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(journalLoadingUnloadingMock));
  });

  test('Should return journalLoadingUnloading by ids transformed', async () => {
    const response = await findJournalLoadingUnloadingService.findByIds(helpers.random.ids);

    expect(response).toEqual(helpers.getTransformedResponse(journalLoadingUnloadingMock));
  });
});
