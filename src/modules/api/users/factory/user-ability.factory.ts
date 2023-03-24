import {
  InferSubjects,
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/api/users';
import { RolePermission as userActions, Role } from 'src/modules/api/roles';

type userSubjects = InferSubjects<typeof User> | 'User' | 'all';

@Injectable()
export class UserAbilityFactory {
  constructor(
    @InjectModel(Role.name, 'api') private readonly roleModel: Model<Role>,
  ) {}

  async createAbilityForUser(user: User) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    const role = await this.roleModel.findOne({ _id: user.role.toString() });

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
        subject.constructor as ExtractSubjectType<userSubjects>,
    });
  }
}
