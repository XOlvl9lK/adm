import { TestHelpers } from '@common/test/testHelpers';
import { ExportJournalKuspService } from '@modules/journal-kusp/services/export-journal-kusp.service';
import {
  findJournalKuspDtoMock,
  journalKuspMock,
} from '@modules/journal-kusp/infrastructure/journal-kusp.elastic-repo.spec';
import { FindJournalKuspService } from '@modules/journal-kusp/services/find-journal-kusp.service';
import { StatusEnum } from '@modules/journal-kusp/domain/status.enum';
import { SourceEnum } from '@modules/journal-kusp/domain/source.enum';
import { JournalKuspController } from '@modules/journal-kusp/controllers/journal-kusp.controller';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { FindJournalKuspDto } from '@modules/journal-kusp/controllers/dtos/find-journal-kusp.dto';
import { validate } from 'class-validator';
import { ExportErrorInfoService } from '@modules/journal-kusp/services/export-error-info.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

const helpers = new TestHelpers().getHelpers();

const exportJournalKuspServiceMockProvider = helpers.getMockExportServiceProvider(ExportJournalKuspService);

export const findJournalKuspServiceMockProvider = helpers.getMockFindService(journalKuspMock, FindJournalKuspService);

const findJournalErrorsIncorrectDtoMock = {
  page: 1,
  pageSize: 10,
  fileTitle: 'consectetur sit',
  kuspNumber: 543,
  signerName: 'Nell Turner',
  regionTitles: ['Регион 4'],
  packageTypes: ['qweasdzxc'],
  statuses: [StatusEnum.SUCCESS],
  sources: [SourceEnum.SPV],
  operatorLogin: 321,
};

describe('JournalKuspController', () => {
  let journalKuspController: JournalKuspController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [JournalKuspController],
      providers: [
        findJournalKuspServiceMockProvider,
        exportJournalKuspServiceMockProvider,
        {
          provide: ExportErrorInfoService,
          useValue: {
            exportErrorInfo: jest.fn(),
          },
        },
      ],
    }).compile();

    journalKuspController = moduleRef.get<JournalKuspController>(JournalKuspController);
  });

  test('Controller should be defined', () => {
    expect(journalKuspController).toBeDefined();
  });

  test('Should return journalKusp transformed', async () => {
    const response = await journalKuspController.getAll(findJournalKuspDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(journalKuspMock, helpers.random.count));
  });

  test('Should pass correct dto', async () => {
    const dtoInstance = plainToInstance(FindJournalKuspDto, findJournalKuspDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(0);
  });

  test('Should did not pass incorrect dto', async () => {
    const dtoInstance = plainToInstance(FindJournalKuspDto, findJournalErrorsIncorrectDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(3);
    expect(JSON.stringify(errors)).toContain('kuspNumber must be a string');
    expect(JSON.stringify(errors)).toContain('each value in packageTypes must be a valid enum value');
    expect(JSON.stringify(errors)).toContain('operatorLogin must be a string');
  });
});
