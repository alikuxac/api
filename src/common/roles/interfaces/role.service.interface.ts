import {
  IDatabaseCreateOptions,
  IDatabaseExistOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseManyOptions,
  IDatabaseCreateManyOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';

import { RoleDoc, RoleEntity } from '../entities/roles.entity';
import { RoleCreateDto } from '../dto/role.create.dto';
import { RoleUpdateDto } from '../dto/role.update.dto';
import { RoleUpdatePermissionDto } from '../dto/role.update-permission.dto';

export interface IRoleService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<RoleEntity[]>;
  findOneById(_id: string, options?: IDatabaseFindOneOptions): Promise<RoleDoc>;
  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<RoleDoc>;
  findOneByName(
    name: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<RoleDoc>;
  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;
  existByName(name: string, options?: IDatabaseExistOptions): Promise<boolean>;
  create(
    data: RoleCreateDto,
    options?: IDatabaseCreateOptions,
  ): Promise<RoleDoc>;
  update(
    repository: RoleDoc,
    data: RoleUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<RoleDoc>;
  updatePermissions(
    repository: RoleDoc,
    data: RoleUpdatePermissionDto,
    options?: IDatabaseSaveOptions,
  ): Promise<RoleDoc>;
  active(repository: RoleDoc, options?: IDatabaseSaveOptions): Promise<RoleDoc>;
  inactive(
    repository: RoleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<RoleDoc>;
  delete(repository: RoleDoc, options?: IDatabaseSaveOptions): Promise<RoleDoc>;
  deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean>;
  createMany(
    data: RoleCreateDto[],
    options?: IDatabaseCreateManyOptions,
  ): Promise<boolean>;
}
