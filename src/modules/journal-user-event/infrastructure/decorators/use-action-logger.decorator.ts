import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { LogUserActionInterceptor } from '../interceptors/log-user-action.interceptor';

export const UseActionLogger = (actionName: string) =>
  applyDecorators(SetMetadata('actionName', actionName), UseInterceptors(LogUserActionInterceptor));
