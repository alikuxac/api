import {
  InferSubjects,
  AbilityBuilder,
  Ability,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { User, UserRole } from '@users/entities';
import { UserRoleService } from '@users/services';
import { UserRolePermission as userActions } from '@users/enum';

type userRoleSubjects = InferSubjects<typeof UserRole> | 'UserRole' | 'all';

type UserRoleAbility = Ability<[userActions, userRoleSubjects]>;

@Injectable()
export class UserRoleAbilityFactory {
  constructor(private readonly userRoleService: UserRoleService) {}

  async createAbilityForUserRole(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[userActions, userRoleSubjects]>
    >(Ability as AbilityClass<UserRoleAbility>);

    const role = await this.userRoleService.findOne(user.role.toString());

    if (user.isOwner) {
      can(userActions.Manage, UserRole);
    }

    const { permissions: rolePerms } = role;

    rolePerms.forEach((perm) => {
      switch (perm) {
        case userActions.ReadRole:
          can(userActions.ReadRole, UserRole);
          break;
        case userActions.CreateRole:
          can(userActions.CreateRole, UserRole);
          break;
        case userActions.UpdateRole:
          can(userActions.UpdateRole, UserRole);
          break;
        case userActions.DeleteRole:
          can(userActions.DeleteRole, UserRole);
          break;
        default:
          break;
      }
    });

    cannot(userActions.UpdateRole, UserRole, { name: { $eq: 'user' } }); // cannot update user role
    cannot(userActions.DeleteRole, UserRole, { name: { $eq: 'user' } }); // cannot delete user role
    cannot(userActions.EditRolePermissions, UserRole, {
      name: { $eq: 'user' },
    }); // cannot edit user role permissions

    return build({
      detectSubjectType: (subject) =>
        subject.constructor as ExtractSubjectType<User>,
    });
  }
}
