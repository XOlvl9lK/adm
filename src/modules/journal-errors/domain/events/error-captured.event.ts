import { User } from '@common/auth/infrastructure/user.interface';
import { BaseEvent } from '@common/base/event.base';
import { SiteSectionEnum } from '../site-section.enum';

interface ErrorCapturedEventProps {
  user: User;
  error: Error;
  siteSectionTitle: SiteSectionEnum;
  requestUrl: string;
}

export class ErrorCapturedEvent extends BaseEvent<ErrorCapturedEventProps> {
  static eventName = 'error-captured';
}
