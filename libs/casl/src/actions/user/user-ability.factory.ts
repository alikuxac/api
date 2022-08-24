import {
  InferSubjects,
  AbilityBuilder,
  Ability,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { User } from '@users/entities';
import { UserRolePermission as userActions } from '@users/enum';
import { UserRoleService } from '@users/services';

type userSubjects = InferSubjects<typeof User> | 'User' | 'all';

type UserAbility = Ability<[userActions, userSubjects]>;

@Injectable()
export class UserAbilityFactory {
  constructor(private readonly userRoleService: UserRoleService) {}

  async createAbilityForUser(user: User): Promise<UserAbility> {
    const { can, build } = new AbilityBuilder<
      Ability<[userActions, userSubjects]>
    >(Ability as AbilityClass<UserAbility>);

    const role = await this.userRoleService.findOne(user.role.toString());

    if (user.isOwner) {
      can(userActions.Manage, User);
    }

    const { permissions: rolePerms } = role;

    rolePerms.forEach((permission) => {
      can(permission, User);
    });

    // Default permissions for all users
    can(userActions.ReadUser, User, { username: { $eq: user.username } }); // get own user
    can(userActions.UpdateUser, User, { username: { $eq: user.username } }); // update own user
    can(userActions.ChangePassword, User, { username: { $eq: user.username } }); // update own password
    can(userActions.ResetPassword, User, { username: { $eq: user.username } }); // reset own password
    can(userActions.CreateUserApiKey, User, {
      username: { $eq: user.username },
    }); // create own api key
    can(userActions.DeleteUserApiKey, User, {
      username: { $eq: user.username },
    }); // delete own api key

    return build({
      detectSubjectType: (subject) =>
        subject.constructor as ExtractSubjectType<User>,
    });
  }
}
