import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Token = createParamDecorator(
  (_, context: ExecutionContext) => context.switchToHttp().getRequest<Request>().headers.authorization,
);
