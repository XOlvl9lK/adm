import { UserEventResultTypeEnum } from '@modules/journal-user-event/domain/user-event-result-type.enum';
import { LogUserEvent } from '@modules/journal-user-event/services/log-user-event.service';
import { Transform } from 'class-transformer';
import { IsDate, isDateString, IsEnum, IsString } from 'class-validator';
import { isDate } from 'lodash';

export class LogUserEventDto implements Omit<LogUserEvent, 'user' | 'browserVersion' | 'ipAddress' | 'url'> {
  @Transform(({ value }) => (isDate(value) || isDateString(value) ? new Date(value) : null))
  @IsDate()
  eventDate: Date;

  @IsEnum(UserEventResultTypeEnum)
  resultTitle: UserEventResultTypeEnum;

  @IsString()
  queryParam: string;
}
