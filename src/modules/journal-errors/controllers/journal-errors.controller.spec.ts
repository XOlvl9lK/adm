import { TestHelpers } from '@common/test/testHelpers';
import { ExportJournalErrorsService } from '@modules/journal-errors/services/export-journal-errors.service';
import {
  findJournalErrorsDtoMock,
  journalErrorsMock,
} from '@modules/journal-errors/infrastructure/journal-errors.elastic-repo.spec';
import { FindJournalErrorsService } from '@modules/journal-errors/services/find-journal-errors.service';
import { JournalErrorsController } from '@modules/journal-errors/controllers/journal-errors.controller';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { FindJournalErrorsDto } from '@modules/journal-errors/controllers/dtos/find-journal-errors.dto';
import { validate } from 'class-validator';
import { EventEmitterModule } from '@nestjs/event-emitter';

const helpers = new TestHelpers().getHelpers();

const exportJournalErrorsServiceMockProvider = helpers.getMockExportServiceProvider(ExportJournalErrorsService);

export const findJournalErrorsServiceMockProvider = helpers.getMockFindService(
  journalErrorsMock,
  FindJournalErrorsService,
);

const findJournalErrorsIncorrectDtoMock = {
  page: 1,
  pageSize: 10,
  ipAddress: '93.240.61.67',
  errorTypeTitle: 'qweasdzxc',
  userLogin: 5674,
  divisionTitles: ['Подразделение 1'],
  regionTitles: ['Регион 1'],
  eventDate: ['2022-09-09T00:54:17.847-06:00', '2022-09-09T00:54:17.847-06:00'] as [string, string],
};

describe('JournalErrorsController', () => {
  let journalErrorsController: JournalErrorsController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [JournalErrorsController],
      providers: [findJournalErrorsServiceMockProvider, exportJournalErrorsServiceMockProvider],
    }).compile();

    journalErrorsController = moduleRef.get<JournalErrorsController>(JournalErrorsController);
  });

  test('Controller should be defined', () => {
    expect(journalErrorsController).toBeDefined();
  });

  test('Should return journalErrors transformed', async () => {
    const response = await journalErrorsController.getAll(findJournalErrorsDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(journalErrorsMock, helpers.random.count));
  });

  test('Should pass correct dto', async () => {
    const dtoInstance = plainToInstance(FindJournalErrorsDto, findJournalErrorsDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(0);
  });

  test('Should did not pass incorrect dto', async () => {
    const dtoInstance = plainToInstance(FindJournalErrorsDto, findJournalErrorsIncorrectDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(2);
    expect(JSON.stringify(errors)).toContain('userLogin must be a string');
    expect(JSON.stringify(errors)).toContain('errorTypeTitle must be a valid enum value');
  });
});
