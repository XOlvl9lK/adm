import { User } from '@common/auth/infrastructure/user.interface';
import { KafkaService } from '@modules/kafka/services/kafka.service';
import { Test } from '@nestjs/testing';
import { UserPerformedActionEvent } from '../domain/events/user-performed-action.event';
import { UserEventResultTypeEnum } from '../domain/user-event-result-type.enum';
import { JournalUserEventsElasticRepo } from '../infrastructure/journal-user-events.elastic-repo';
import { LogUserEventService } from './log-user-event.service';
import { UserPerformedActionService } from './user-performed-action.service';

const mockKafkaService = {
  send: jest.fn(),
};

const mockUserEventElasticRepo = {
  index: 'index',
};

const mockService = {
  handle: jest.fn(),
};

describe('UserPerformedActionService', () => {
  let service: UserPerformedActionService;

  beforeEach(async () => jest.resetAllMocks());

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: KafkaService, useValue: mockKafkaService },
        {
          provide: JournalUserEventsElasticRepo,
          useValue: mockUserEventElasticRepo,
        },
        {
          provide: LogUserEventService,
          useValue: mockService,
        },
        UserPerformedActionService,
      ],
    }).compile();
    service = moduleRef.get(UserPerformedActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send message to kafka', async () => {
    const event = new UserPerformedActionEvent({
      user: {
        ip: 'ip',
        username: 'username',
        subdivision: {
          id: 'id',
          name: 'name',
        },
        department: {
          id: 'id',
          name: 'name',
        },
        okato: {
          id: 'id',
          name: 'name',
        },
      } as unknown as User,
      url: 'url',
      browserVersion: 'browserVersion',
      queryParam: 'queryParam',
      resultTitle: UserEventResultTypeEnum.ERROR,
    });

    await service.handle(event);
    expect(mockService.handle).toHaveBeenCalledWith({
      ...event.props,
      eventDate: event.eventDate,
    });
  });
});
