import {
  IDatabaseCreateOptions,
  IDatabaseExistOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { createUserDto } from 'src/modules/api/users/dto/user.dto';
import {
  IUserDoc,
  IUserEntity,
} from 'src/modules/api/users/interfaces/user.interface';
import {
  UserDoc,
  UserEntity,
} from 'src/modules/api/users/entities/user.entity';
import { UserPayloadSerialization } from 'src/modules/api/users/serializations/user.payload.serialization';

export interface IUserService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IUserEntity[]>;
  findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;
  findOne<T>(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<T>;
  findOneByUsername<T>(
    username: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T>;
  findOneByEmail<T>(
    email: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T>;
  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;
  create(
    { firstName, lastName, email, role, password }: createUserDto,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc>;
  existByEmail(
    email: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean>;
  existByUsername(
    username: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean>;
  delete(repository: UserDoc, options?: IDatabaseSaveOptions): Promise<UserDoc>;
  updatePassword(
    repository: UserDoc,
    newPassword: string,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;
  verify(repository: UserDoc, options?: IDatabaseSaveOptions): Promise<UserDoc>;
  active(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserEntity>;
  inactive(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;
  disable(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;
  enable(repository: UserDoc, options?: IDatabaseSaveOptions): Promise<UserDoc>;
  ban(repository: UserDoc, options?: IDatabaseSaveOptions): Promise<UserDoc>;
  unban(repository: UserDoc, options?: IDatabaseSaveOptions): Promise<UserDoc>;
  joinWithRole(repository: UserDoc): Promise<IUserDoc>;
  payloadSerialization(data: IUserDoc): Promise<UserPayloadSerialization>;
}
