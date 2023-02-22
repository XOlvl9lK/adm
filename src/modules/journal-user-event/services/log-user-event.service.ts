import { User } from '@common/auth/infrastructure/user.interface';
import { applyTimezoneToDate, formatDate, getUserTimezone } from '@common/utils/getClientDateAndTime';
import { KafkaService } from '@modules/kafka/services/kafka.service';
import { Injectable } from '@nestjs/common';
import { UserEventResultTypeEnum } from '../domain/user-event-result-type.enum';
import { JournalUserEventsElasticRepo } from '../infrastructure/journal-user-events.elastic-repo';

export interface LogUserEvent {
  eventDate: Date;
  url: string;
  resultTitle: UserEventResultTypeEnum;
  queryParam: string;
  browserVersion: string;
  user: User;
}

@Injectable()
export class LogUserEventService {
  constructor(private userEventElasticRepo: JournalUserEventsElasticRepo, private kafkaService: KafkaService) {}

  async handle({ user, browserVersion, eventDate, ...other }: LogUserEvent) {
    const eventDateWithTimezone = formatDate(
      user.timeZone
        ? applyTimezoneToDate(eventDate.toISOString(), getUserTimezone(user.timeZone.toString()))
        : eventDate.toISOString(),
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
    );
    return await this.kafkaService.send(this.userEventElasticRepo.index, {
      messages: [
        {
          value: {
            userLogin: user.username,
            browserVersion,
            eventDate: eventDateWithTimezone,
            ...other,
            ipAddress: user.ip,
            divisionId: user.subdivision.id,
            divisionTitle: user.subdivision.name,
            departmentId: user.department.id,
            departmentTitle: user.department.name,
            regionId: user.okato.id,
            regionTitle: user.okato.name,
          },
        },
      ],
    });
  }
}
