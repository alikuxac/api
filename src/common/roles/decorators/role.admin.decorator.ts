import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ROLE_IS_ACTIVE_META_KEY } from 'src/common/roles/constants/role.constant';
import { RoleActiveGuard } from 'src/common/roles/guards/role.active.guard';
import { RoleNotFoundGuard } from 'src/common/roles/guards/role.not-found.guard';
import { RolePutToRequestGuard } from 'src/common/roles/guards/role.put-to-request.guard';

export function RoleAdminGetGuard(): MethodDecorator {
  return applyDecorators(UseGuards(RolePutToRequestGuard, RoleNotFoundGuard));
}

export function RoleAdminUpdateGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(RolePutToRequestGuard, RoleNotFoundGuard, RoleActiveGuard),
    SetMetadata(ROLE_IS_ACTIVE_META_KEY, [true]),
  );
}

export function RoleAdminDeleteGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(RolePutToRequestGuard, RoleNotFoundGuard, RoleActiveGuard),
    SetMetadata(ROLE_IS_ACTIVE_META_KEY, [true]),
  );
}

export function RoleAdminUpdateActiveGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(RolePutToRequestGuard, RoleNotFoundGuard, RoleActiveGuard),
    SetMetadata(ROLE_IS_ACTIVE_META_KEY, [false]),
  );
}

export function RoleAdminUpdateInactiveGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(RolePutToRequestGuard, RoleNotFoundGuard, RoleActiveGuard),
    SetMetadata(ROLE_IS_ACTIVE_META_KEY, [true]),
  );
}
