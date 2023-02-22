import {
  findJournalCancellationStatisticalCardDtoMock,
  journalCancellationStatisticalCardMock,
  // eslint-disable-next-line max-len
} from '@modules/journal-cancellation-statistical-card/infrastructure/journal-cancellation-statistical-card.elastic-repo.spec';
import { TestHelpers } from '@common/test/testHelpers';
// eslint-disable-next-line max-len
import { JournalCancellationStatisticalCardController } from '@modules/journal-cancellation-statistical-card/controllers/journal-cancellation-statistical-card.controller';
import { Test } from '@nestjs/testing';
// eslint-disable-next-line max-len
import { FindJournalCancellationStatisticalCardService } from '@modules/journal-cancellation-statistical-card/services/find-journal-cancellation-statistical-card.service';
// eslint-disable-next-line max-len
import { ExportJournalCancellationStatisticalCardService } from '@modules/journal-cancellation-statistical-card/services/export-journal-cancellation-statistical-card.service';
import { plainToInstance } from 'class-transformer';
// eslint-disable-next-line max-len
import { FindJournalCancellationStatisticalCardDto } from '@modules/journal-cancellation-statistical-card/controllers/dtos/find-journal-cancellation-statistical-card.dto';
import { validate } from 'class-validator';
import clearAllMocks = jest.clearAllMocks;
import { EventEmitterModule } from '@nestjs/event-emitter';

const helpers = new TestHelpers().getHelpers();

const exportJournalCancellationStatisticalCardServiceMockProvider = helpers.getMockExportServiceProvider(
  ExportJournalCancellationStatisticalCardService,
);

export const findJournalCancellationStatisticalCardServiceMockProvider = helpers.getMockFindService(
  journalCancellationStatisticalCardMock,
  FindJournalCancellationStatisticalCardService,
);

export const findJournalCancellationStatisticalCardIncorrectDtoMock = {
  page: 1,
  pageSize: 10,
  ikud: 5432,
  formNumber: ['FormNumberEnum.UD'],
  regionTitles: ['Регион 1'],
  operationDate: ['2020-10-10T04:15:43.847+04:00', '2010-12-30T14:26:22.847+04:00'] as [string, string],
};

describe('JournalCancellationStatisticalCardController', () => {
  let journalCancellationStatisticalCardController: JournalCancellationStatisticalCardController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [JournalCancellationStatisticalCardController],
      providers: [
        findJournalCancellationStatisticalCardServiceMockProvider,
        exportJournalCancellationStatisticalCardServiceMockProvider,
      ],
    }).compile();

    journalCancellationStatisticalCardController = moduleRef.get<JournalCancellationStatisticalCardController>(
      JournalCancellationStatisticalCardController,
    );
  });

  test('Controller should be defined', () => {
    expect(journalCancellationStatisticalCardController).toBeDefined();
  });

  test('Should return cancellationStatisticalCard transformed', async () => {
    const response = await journalCancellationStatisticalCardController.getAll(
      findJournalCancellationStatisticalCardDtoMock,
    );

    expect(response).toEqual(
      helpers.getTransformedResponse(journalCancellationStatisticalCardMock, helpers.random.count),
    );
  });

  test('Should pass correct dto', async () => {
    const dtoInstance = plainToInstance(
      FindJournalCancellationStatisticalCardDto,
      findJournalCancellationStatisticalCardDtoMock,
    );

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(0);
  });

  test('Should did not pass incorrect dto', async () => {
    const dtoInstance = plainToInstance(
      FindJournalCancellationStatisticalCardDto,
      findJournalCancellationStatisticalCardIncorrectDtoMock,
    );

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(2);
    expect(JSON.stringify(errors)).toContain('ikud must be a string');
    expect(JSON.stringify(errors)).toContain('each value in formNumber must be a valid enum value');
  });

  afterEach(() => {
    clearAllMocks();
  });
});
