import { ErrorCapturedEvent } from '@modules/journal-errors/domain/events/error-captured.event';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { catchError } from 'rxjs';
import { userUrlToSection } from '../constants/user-url-to-section.constant';

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userLocation = request.header('user-location');
    if (!user) return next.handle();
    return next.handle().pipe(
      catchError((error) => {
        this.eventEmitter.emitAsync(
          ErrorCapturedEvent.eventName,
          new ErrorCapturedEvent({
            user,
            error,
            siteSectionTitle: userUrlToSection[userLocation] || null,
            requestUrl: request.url,
          }),
        );
        throw error;
      }),
    );
  }
}
