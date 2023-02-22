import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from '../guards/permission.guard';

export const ApplyAuth = (permissions: string[] | string = [], operand: 'OR' | 'AND' = 'AND') =>
  applyDecorators(
    SetMetadata('permissions', Array.isArray(permissions) ? permissions : [permissions]),
    SetMetadata('permissions-operand', operand),
    UseGuards(AuthGuard('local'), PermissionGuard),
  );
