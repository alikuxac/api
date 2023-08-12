import { RoleDoc, RoleEntity } from 'src/common/roles/entities/roles.entity';
import {
  UserDoc,
  UserEntity,
} from 'src/modules/api/users/entities/user.entity';

export interface IUserEntity extends Omit<UserEntity, 'role'> {
  role: RoleEntity;
}

export interface IUserDoc extends Omit<UserDoc, 'role'> {
  role: RoleDoc;
}
