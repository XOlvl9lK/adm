import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export { Request } from 'express';

export const RequestUser = createParamDecorator(
  (_: never, context: ExecutionContext) => context.switchToHttp().getRequest().user,
);
