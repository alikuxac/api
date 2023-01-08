import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable, Inject, forwardRef } from '@nestjs/common';

import { User } from '@users';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';
import { RolePermission } from './role.enum';

type roleSubjects = InferSubjects<typeof Role> | 'Role' | 'all';

@Injectable()
export class RoleAbilityFactory {
  constructor(
    @Inject(forwardRef(() => RolesService))
    private readonly roleService: RolesService,
  ) {}
  async createAbilityForUser(user: User) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    const role = await this.roleService.findOne(user.role.toString());

    if (user.isOwner) {
      can(RolePermission.Manage, Role);
    }

    const { permissions: rolePerms } = role;

    rolePerms.forEach((permission) => {
      can(permission, Role);
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<roleSubjects>,
    });
  }
}
