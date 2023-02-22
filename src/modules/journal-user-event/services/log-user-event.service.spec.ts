import { User } from '@common/auth/infrastructure/user.interface';
import { KafkaService } from '@modules/kafka/services/kafka.service';
import { Test } from '@nestjs/testing';
import { UserEventResultTypeEnum } from '../domain/user-event-result-type.enum';
import { JournalUserEventsElasticRepo } from '../infrastructure/journal-user-events.elastic-repo';
import { LogUserEventService } from './log-user-event.service';
import { applyTimezoneToDate, formatDate } from '@common/utils/getClientDateAndTime';

const mockJournalUserEventsRepository = {
  index: 'index',
};

const mockKafkaService = {
  send: jest.fn(),
};

describe('LogUserEventService', () => {
  let service: LogUserEventService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LogUserEventService,
        {
          provide: JournalUserEventsElasticRepo,
          useValue: mockJournalUserEventsRepository,
        },
        {
          provide: KafkaService,
          useValue: mockKafkaService,
        },
      ],
    }).compile();
    service = moduleRef.get(LogUserEventService);
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call kafkaService.send with correctData', async () => {
    const mockUser = {
      username: 'username',
      ip: 'ip',
      okato: {
        id: 1,
        name: 'okato',
      },
      department: {
        id: 1,
        name: 'department',
      },
      subdivision: {
        id: 1,
        name: 'division',
      },
      timeZone: 180,
    } as unknown as User;
    const mockDto = {
      eventDate: new Date(),
      user: mockUser,
      ipAddress: 'ipAddress',
      browserVersion: 'browserVersion',
      url: 'url',
      queryParam: 'queryParam',
      resultTitle: UserEventResultTypeEnum.SUCCESS,
    };
    await service.handle(mockDto);
    expect(mockKafkaService.send).toBeCalledWith('index', {
      messages: [
        {
          value: {
            userLogin: mockUser.username,
            eventDate: formatDate(
              applyTimezoneToDate(mockDto.eventDate.toISOString(), mockUser.timeZone.toString()),
              "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
            ),
            url: mockDto.url,
            browserVersion: mockDto.browserVersion,
            ipAddress: mockDto.user.ip,
            resultTitle: mockDto.resultTitle,
            queryParam: mockDto.queryParam,
            divisionTitle: mockUser.subdivision.name,
            divisionId: mockUser.subdivision.id,
            departmentTitle: mockUser.department.name,
            departmentId: mockUser.department.id,
            regionTitle: mockUser.okato.name,
            regionId: mockUser.okato.id,
          },
        },
      ],
    });
  });
});
