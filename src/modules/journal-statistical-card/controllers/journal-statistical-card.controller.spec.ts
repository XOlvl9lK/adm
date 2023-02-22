/* eslint-disable max-len */
import { TestHelpers } from '@common/test/testHelpers';
import { ExportJournalStatisticalCardService } from '@modules/journal-statistical-card/services/export-journal-statistical-card.service';
import {
  findJournalStatisticalCardDtoMock,
  journalStatisticalCardMock,
} from '@modules/journal-statistical-card/infrastructure/journal-statistical-card.elastic-repo.spec';
import { FindJournalStatisticalCardService } from '@modules/journal-statistical-card/services/find-journal-statistical-card.service';
import { StatisticalCardSourceEnum } from '@modules/journal-statistical-card/domain/statistical-card-source.enum';
import { JournalStatisticalCardController } from '@modules/journal-statistical-card/controllers/journal-statistical-card.controller';
import { Test } from '@nestjs/testing';
import { ExportStatusHistoryService } from '@modules/journal-statistical-card/services/export-status-history.service';
import { ExportErrorInfoService } from '@modules/journal-statistical-card/services/export-error-info.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FindJournalStatisticalCardDto } from '@modules/journal-statistical-card/controllers/dtos/find-journal-statistical-card.dto';
import { EventEmitterModule } from '@nestjs/event-emitter';

const helpers = new TestHelpers().getHelpers();

const exportJournalStatisticalCardMockProvider = helpers.getMockExportServiceProvider(
  ExportJournalStatisticalCardService,
);

export const findJournalStatisticalCardMockProvider = helpers.getMockFindService(
  journalStatisticalCardMock,
  FindJournalStatisticalCardService,
);

const findJournalStatisticalCardIncorrectMockDto = {
  page: 1,
  pageSize: 10,
  cardId: '62b2ee2e8972d6b461d8db78',
  operatorLogin: 123,
  sourceTitle: [StatisticalCardSourceEnum.SCD],
};

describe('JournalStatisticalCardController', () => {
  let journalStatisticalCardController: JournalStatisticalCardController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [JournalStatisticalCardController],
      providers: [
        findJournalStatisticalCardMockProvider,
        exportJournalStatisticalCardMockProvider,
        {
          provide: ExportStatusHistoryService,
          useValue: {
            exportStatusHistory: jest.fn(),
          },
        },
        {
          provide: ExportErrorInfoService,
          useValue: {
            exportErrorInfo: jest.fn(),
          },
        },
      ],
    }).compile();

    journalStatisticalCardController = moduleRef.get<JournalStatisticalCardController>(
      JournalStatisticalCardController,
    );
  });

  test('Controller should be defined', () => {
    expect(journalStatisticalCardController).toBeDefined();
  });

  test('Should return statisticalCard transformed', async () => {
    const response = await journalStatisticalCardController.getAll(findJournalStatisticalCardDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(journalStatisticalCardMock, helpers.random.count));
  });

  test('Should pass correct dto', async () => {
    const dtoInstance = plainToInstance(FindJournalStatisticalCardDto, findJournalStatisticalCardDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(0);
  });

  test('Should did not pass incorrect dto', async () => {
    const dtoInstance = plainToInstance(FindJournalStatisticalCardDto, findJournalStatisticalCardIncorrectMockDto);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(1);
    expect(JSON.stringify(errors)).toContain('operatorLogin must be a string');
  });
});
