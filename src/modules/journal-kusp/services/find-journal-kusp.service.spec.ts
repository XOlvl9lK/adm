import { TestHelpers } from '@common/test/testHelpers';
import {
  findJournalKuspDtoMock,
  journalKuspMock,
} from '@modules/journal-kusp/infrastructure/journal-kusp.elastic-repo.spec';
import { FindJournalKuspService } from '@modules/journal-kusp/services/find-journal-kusp.service';
import { Test } from '@nestjs/testing';
import { JournalKuspElasticRepo } from '@modules/journal-kusp/infrastructure/journal-kusp.elastic-repo';

const helpers = new TestHelpers().getHelpers();

const journalErrorsElasticRepoMock = helpers.getMockElasticRepo(journalKuspMock);

describe('FindJournalKuspService', () => {
  let findJournalKuspService: FindJournalKuspService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindJournalKuspService,
        {
          provide: JournalKuspElasticRepo,
          useValue: journalErrorsElasticRepoMock,
        },
      ],
    }).compile();

    findJournalKuspService = moduleRef.get<FindJournalKuspService>(FindJournalKuspService);
  });

  test('Service should be defined', () => {
    expect(findJournalKuspService).toBeDefined();
  });

  test('Should return journalKusp transformed', async () => {
    const response = await findJournalKuspService.findAll(findJournalKuspDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(journalKuspMock));
  });

  test('Should return journalErrors by ids transformed', async () => {
    const response = await findJournalKuspService.findByIds(helpers.random.ids);

    expect(response).toEqual(helpers.getTransformedResponse(journalKuspMock));
  });
});
