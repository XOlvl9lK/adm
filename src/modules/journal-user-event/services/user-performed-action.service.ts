import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserPerformedActionEvent } from '../domain/events/user-performed-action.event';
import { LogUserEventService } from './log-user-event.service';

@Injectable()
export class UserPerformedActionService {
  constructor(private readonly logUserEventService: LogUserEventService) {}

  @OnEvent(UserPerformedActionEvent.eventName)
  async handle({ props, eventDate }: UserPerformedActionEvent) {
    return await this.logUserEventService.handle({
      ...props,
      eventDate,
    });
  }
}
