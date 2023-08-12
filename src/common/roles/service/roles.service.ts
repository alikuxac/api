import { Injectable, OnModuleInit } from '@nestjs/common';
import { RoleUpdateDto } from '../dto/role.update.dto';

import { RoleDoc, RoleEntity } from '../entities/roles.entity';

import {
  IDatabaseCreateOptions,
  IDatabaseExistOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseCreateManyOptions,
  IDatabaseManyOptions,
  IDatabaseSaveOptions,
} from '@root/common/database/interfaces/database.interface';

import { RoleRepository } from '../repositories/role.repository';

import { IRoleService } from '../interfaces/role.service.interface';
import { RoleCreateDto } from '../dto/role.create.dto';
import { RoleUpdatePermissionDto } from '../dto/role.update-permission.dto';

@Injectable()
export class RolesService implements OnModuleInit, IRoleService {
  private defaultRoleName = 'everyone';

  constructor(private readonly roleRepository: RoleRepository) {}

  get getDefaultRoleName() {
    return this.defaultRoleName;
  }

  async onModuleInit() {
    await this.roleRepository.init();
  }

  getTotal(find?: Record<string, any>) {
    return this.roleRepository.getTotal(find);
  }

  async create(
    { name, description, permissions }: RoleCreateDto,
    options?: IDatabaseCreateOptions,
  ) {
    const createdEntity = new RoleEntity();
    createdEntity.name = name;
    createdEntity.description = description ?? '';
    createdEntity.permissions = permissions ?? [];

    return this.roleRepository.create<RoleEntity>(createdEntity, options);
  }

  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<RoleEntity[]> {
    return this.roleRepository.findAll<RoleEntity>(find, options);
  }

  async findOne(
    find?: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<RoleDoc> {
    return this.roleRepository.findOne<RoleDoc>(find, options);
  }

  async findOneByName(
    name: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<RoleDoc> {
    return this.roleRepository.findOne<RoleDoc>({ name }, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<RoleDoc> {
    return this.roleRepository.findOneById<RoleDoc>(_id, options);
  }

  async existByName(
    name: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean> {
    return this.roleRepository.exists(
      {
        name,
      },
      { ...options, withDeleted: true },
    );
  }

  async update(
    repository: RoleDoc,
    { description }: RoleUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<RoleDoc> {
    repository.description = description;

    return this.roleRepository.save(repository, options);
  }

  async updatePermissions(
    repository: RoleDoc,
    { permissions }: RoleUpdatePermissionDto,
    options?: IDatabaseSaveOptions,
  ): Promise<RoleDoc> {
    repository.permissions = permissions;

    return this.roleRepository.save(repository, options);
  }

  async active(
    repository: RoleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<RoleDoc> {
    repository.isActive = true;

    return this.roleRepository.save(repository, options);
  }

  async inactive(
    repository: RoleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<RoleDoc> {
    repository.isActive = false;

    return this.roleRepository.save(repository, options);
  }

  async delete(
    repository: RoleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<RoleDoc> {
    return this.roleRepository.softDelete(repository, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.roleRepository.deleteMany(find, options);
  }

  async createMany(
    data: RoleCreateDto[],
    options?: IDatabaseCreateManyOptions,
  ): Promise<boolean> {
    const create: RoleEntity[] = data.map(({ name, permissions }) => {
      const entity: RoleEntity = new RoleEntity();
      entity.name = name;
      entity.permissions = permissions;

      return entity;
    });
    return this.roleRepository.createMany<RoleEntity>(create, options);
  }
}
