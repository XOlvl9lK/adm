import { getBrowserVersionByUserAgent } from '@common/utils/get-browser-version-by-user-agent';
import { UserPerformedActionEvent } from '@modules/journal-user-event/domain/events/user-performed-action.event';
import { UserEventResultTypeEnum } from '@modules/journal-user-event/domain/user-event-result-type.enum';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { catchError, tap } from 'rxjs';

@Injectable()
export class LogUserActionInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector, private readonly eventEmitter: EventEmitter2) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const actionName = this.reflector.get<string>('actionName', context.getHandler());
    const user = request.user;
    if (!user) return next.handle();
    const userLocation = request.header('user-location');

    const props = {
      browserVersion: getBrowserVersionByUserAgent(request.header('user-agent')),
      url: userLocation,
      queryParam: actionName,
      user,
    };
    return next.handle().pipe(
      catchError((err) => {
        this.eventEmitter.emitAsync(
          UserPerformedActionEvent.eventName,
          new UserPerformedActionEvent({
            ...props,
            resultTitle: UserEventResultTypeEnum.ERROR,
          }),
        );
        throw err;
      }),
      tap(() => {
        this.eventEmitter.emitAsync(
          UserPerformedActionEvent.eventName,
          new UserPerformedActionEvent({
            ...props,
            resultTitle: UserEventResultTypeEnum.SUCCESS,
          }),
        );
      }),
    );
  }
}
