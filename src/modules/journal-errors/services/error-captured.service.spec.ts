import { User } from '@common/auth/infrastructure/user.interface';
import { KafkaService } from '@modules/kafka/services/kafka.service';
import { Test } from '@nestjs/testing';
import { format } from 'date-fns';
import { ErrorTypeEnum } from '../domain/error-type.enum';
import { ErrorCapturedEvent } from '../domain/events/error-captured.event';
import { SiteSectionEnum } from '../domain/site-section.enum';
import { JournalErrorsElasticRepo } from '../infrastructure/journal-errors.elastic-repo';
import { ErrorCapturedService } from './error-captured.service';

const mockKafkaService = {
  send: jest.fn(),
};

const mockJournalErrorsElasticRepo = {
  index: 'index',
};

describe('ErrorCapturedService', () => {
  let service: ErrorCapturedService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: KafkaService, useValue: mockKafkaService },
        {
          provide: JournalErrorsElasticRepo,
          useValue: mockJournalErrorsElasticRepo,
        },
        ErrorCapturedService,
      ],
    }).compile();
    service = module.get<ErrorCapturedService>(ErrorCapturedService);
  });

  beforeEach(() => jest.resetAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send message to kafka', async () => {
    const error = new Error('test');
    const event = new ErrorCapturedEvent({
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
      error,
      siteSectionTitle: SiteSectionEnum.ADMINISTRATION_CANCELLATION,
      requestUrl: 'requestUrl',
    });
    await service.handle(event);
    expect(mockKafkaService.send).toHaveBeenCalledWith(mockJournalErrorsElasticRepo.index, {
      messages: [
        {
          value: {
            userLogin: event.props.user.username,
            eventDate: format(event.eventDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            ipAddress: event.props.user.ip,
            errorTypeTitle: ErrorTypeEnum.SYSTEM,
            // eslint-disable-next-line max-len
            errorDescription: `Текст ошибки: ${error.message}\nЗапрос: ${event.props.requestUrl}\nОписание: ${error.stack}`,
            divisionId: event.props.user.subdivision.id,
            divisionTitle: event.props.user.subdivision.name,
            departmentId: event.props.user.department.id,
            departmentTitle: event.props.user.department.name,
            regionId: event.props.user.okato.id,
            regionTitle: event.props.user.okato.name,
            siteSectionTitle: event.props.siteSectionTitle,
          },
        },
      ],
    });
  });
});
