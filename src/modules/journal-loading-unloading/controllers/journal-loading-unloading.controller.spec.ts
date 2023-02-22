import { TestHelpers } from '@common/test/testHelpers';
// eslint-disable-next-line max-len
import { ExportJournalLoadingUnloadingService } from '@modules/journal-loading-unloading/services/export-journal-loading-unloading.service';
import {
  findJournalLoadingUnloadingDtoMock,
  journalLoadingUnloadingMock,
} from '@modules/journal-loading-unloading/infrastructure/journal-loading-unloading.elastic-repo.spec';
// eslint-disable-next-line max-len
import { FindJournalLoadingUnloadingService } from '@modules/journal-loading-unloading/services/find-journal-loading-unloading.service';
import { ProcessingResultEnum } from '@modules/journal-loading-unloading/domain/processing-result.enum';
// eslint-disable-next-line max-len
import { JournalLoadingUnloadingController } from '@modules/journal-loading-unloading/controllers/journal-loading-unloading.controller';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
// eslint-disable-next-line max-len
import { FindJournalLoadingUnloadingDto } from '@modules/journal-loading-unloading/controllers/dtos/find-journal-loading-unloading.dto';
import { validate } from 'class-validator';
import { EventEmitterModule } from '@nestjs/event-emitter';

const helpers = new TestHelpers().getHelpers();

const exportJournalLoadingUnloadingServiceMockProvider = helpers.getMockExportServiceProvider(
  ExportJournalLoadingUnloadingService,
);

export const findJournalLoadingUnloadingServiceMockProvider = helpers.getMockFindService(
  journalLoadingUnloadingMock,
  FindJournalLoadingUnloadingService,
);

const findJournalLoadingUnloadingIncorrectDto = {
  page: 1,
  pageSize: 10,
  fileTitle: [123],
  processingResult: [ProcessingResultEnum.ERRORS_PRESENT],
};

describe('JournalLoadingUnloadingController', () => {
  let journalLoadingUnloadingController: JournalLoadingUnloadingController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [JournalLoadingUnloadingController],
      providers: [exportJournalLoadingUnloadingServiceMockProvider, findJournalLoadingUnloadingServiceMockProvider],
    }).compile();

    journalLoadingUnloadingController = moduleRef.get<JournalLoadingUnloadingController>(
      JournalLoadingUnloadingController,
    );
  });

  test('Controller should be defined', () => {
    expect(journalLoadingUnloadingController).toBeDefined();
  });

  test('Should return journalLoadingUnloading transformed', async () => {
    const response = await journalLoadingUnloadingController.getAll(findJournalLoadingUnloadingDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(journalLoadingUnloadingMock, helpers.random.count));
  });

  test('Should pass correct dto', async () => {
    const dtoInstance = plainToInstance(FindJournalLoadingUnloadingDto, findJournalLoadingUnloadingDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(0);
  });

  test('Should did not pass incorrect dto', async () => {
    const dtoInstance = plainToInstance(FindJournalLoadingUnloadingDto, findJournalLoadingUnloadingIncorrectDto);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(1);
    expect(JSON.stringify(errors)).toContain('fileTitle must be a string');
  });
});
