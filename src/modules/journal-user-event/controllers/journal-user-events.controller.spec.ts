import { TestHelpers } from '@common/test/testHelpers';
// eslint-disable-next-line max-len
import { ExportJournalUserEventsService } from '@modules/journal-user-event/services/export-journal-user-events.service';
import { FindJournalUserEventsService } from '@modules/journal-user-event/services/find-journal-user-events.service';
import {
  findUserEventsDtoMock,
  userEventsMock,
} from '@modules/journal-user-event/infrastructure/journal-user-events.elastic-repo.spec';
import { UserEventResultTypeEnum } from '@modules/journal-user-event/domain/user-event-result-type.enum';
import { JournalUserEventsController } from '@modules/journal-user-event/controllers/journal-user-events.controller';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FindUserEventDto } from '@modules/journal-user-event/controllers/dtos/find-user-event.dto';
import { LogUserEventService } from '../services/log-user-event.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

const helpers = new TestHelpers().getHelpers();

const exportUserEventsMockProvider = helpers.getMockExportServiceProvider(ExportJournalUserEventsService);

export const findUserEventsMockProvider = helpers.getMockFindService(userEventsMock, FindJournalUserEventsService);

const findUserEventsIncorrectDtoMock = {
  page: 1,
  pageSize: 20,
  userLogin: ['Mcgowan'],
  ipAddress: '177.154.72.233',
  browserVersion: 10,
  result: UserEventResultTypeEnum.SUCCESS,
};

const logUserEventServiceMock = {};

describe('JournalUserEventsController', () => {
  let journalUserEventsController: JournalUserEventsController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [JournalUserEventsController],
      providers: [
        exportUserEventsMockProvider,
        findUserEventsMockProvider,
        { provide: LogUserEventService, useValue: logUserEventServiceMock },
      ],
    }).compile();

    journalUserEventsController = moduleRef.get<JournalUserEventsController>(JournalUserEventsController);
  });

  test('Controller should be defined', () => {
    expect(journalUserEventsController).toBeDefined();
  });

  test('Should return userEvents transformed', async () => {
    const response = await journalUserEventsController.getAll(findUserEventsDtoMock);

    expect(response).toEqual(helpers.getTransformedResponse(userEventsMock, helpers.random.count));
  });

  test('Should pass correct dto', async () => {
    const dtoInstance = plainToInstance(FindUserEventDto, findUserEventsDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(0);
  });

  test('Should did not pass incorrect dto', async () => {
    const dtoInstance = plainToInstance(FindUserEventDto, findUserEventsIncorrectDtoMock);

    const errors = await validate(dtoInstance);

    expect(errors.length).toBe(2);
    expect(JSON.stringify(errors)).toContain('userLogin must be a string');
    expect(JSON.stringify(errors)).toContain('browserVersion must be a string');
  });
});
