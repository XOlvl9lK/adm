import { BaseEvent } from '@common/base/event.base';
import { LogUserEvent } from '@modules/journal-user-event/services/log-user-event.service';

export type UserPerformedActionProps = Omit<LogUserEvent, 'eventDate'>;

export class UserPerformedActionEvent extends BaseEvent<UserPerformedActionProps> {
  public static eventName = 'user-performed-action';
}
