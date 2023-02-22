import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from '../infrastructure/request-with-user.type';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const permissions = this.getHandlerPermissions(context);
    const operand = this.getHandlerPermissionOperand(context);

    if (!permissions || !permissions.length) return true;
    const user = request.user;
    const availablePermissions = permissions.map((permission) => user.permissions.includes(permission));
    return operand === 'AND'
      ? availablePermissions.every((available) => available)
      : availablePermissions.some((available) => available);
  }

  private getHandlerPermissions(context: ExecutionContext): string[] {
    return this.reflector.get<string[]>('permissions', context.getHandler());
  }

  private getHandlerPermissionOperand(context: ExecutionContext): 'OR' | 'AND' {
    return this.reflector.get<string>('permissions-operand', context.getHandler()) as 'OR' | 'AND';
  }
}
