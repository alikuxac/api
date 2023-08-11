import { Injectable, HttpException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { isEmail } from 'class-validator';

import { IUserService } from '../interfaces/user.service.interface';
import {
  IDatabaseCreateOptions,
  IDatabaseExistOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@root/common/database/interfaces/database.interface';

// Entity
import {
  UserDoc,
  UserEntity,
} from 'src/modules/api/users/entities/user.entity';

import { UserRepository } from '../repositories/user.repository';

// Dto
import {
  createUserDto,
  // updateUserDto,
} from 'src/modules/api/users/dto/user.dto';
// Service
import { RoleEntity } from 'src/common/roles/entities/roles.entity';
import { RolesService } from '@root/common/roles/service/roles.service';
import { IUserDoc, IUserEntity } from '../interfaces/user.interface';
import { HelperDateService } from '@root/common/helper/services/helper.date.service';

import { UserPayloadSerialization } from '../serializations/user.payload.serialization';

@Injectable()
export class UsersService implements OnModuleInit, IUserService {
  private _adminEmail: string;
  private _adminPassword: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly rolesService: RolesService,
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
  ) {
    this._adminEmail = this.configService.get('ADMIN_EMAIL');
    this._adminPassword = this.configService.get('ADMIN_PASSWORD');
  }

  async onModuleInit() {
    const role = await this.rolesService.findOneByName('everyone');
    const users = await this.findAll();
    if (users.length === 0) {
      const admin = new UserEntity();
      admin.username = 'admin';
      admin.email = this._adminEmail;
      admin.password = this._adminPassword;
      admin.role = role._id;
      admin.isOwner = true;

      this.userRepository.create(admin);
    }
  }

  // Check if user exists
  async exists(id: string) {
    return await this.userRepository.exists({ _id: id }, { withDeleted: true });
  }

  async existByEmail(
    email: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean> {
    return this.userRepository.exists(
      {
        email: {
          $regex: new RegExp(`\\b${email}\\b`),
          $options: 'i',
        },
      },
      { ...options, withDeleted: true },
    );
  }

  async existByUsername(
    username: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean> {
    return this.userRepository.exists(
      { username },
      { ...options, withDeleted: true },
    );
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.userRepository.getTotal(find, { ...options, join: true });
  }

  /**
   * Find all
   * @returns Users
   */
  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IUserEntity[]> {
    return this.userRepository.findAll<IUserEntity>(find, {
      ...options,
      join: true,
    });
  }

  /**
   * Find user by Id
   * @param id User id
   * @returns User
   */
  async findOne<T>(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.userRepository.findOne<T>(find, options);
  }

  /**
   * Find user by username
   * @param username Username
   * @returns User
   */
  async findByUsername(username: string) {
    const result = await this.userRepository.findAll({
      username: username.toLowerCase(),
    });
    return result;
  }

  /**
   * Find user by email
   * @param email Email
   * @returns User
   */
  async findByEmail(email: string) {
    const IsEmail = isEmail(email);
    if (!IsEmail) {
      throw new HttpException('Email is not valid', 400);
    }
    const result = await this.userRepository.findOne({ email });
    return result;
  }

  async findByUsernameOrEmail(value: string) {
    const result = this.userRepository.findOne({
      $or: [{ username: value }, { email: value }],
    });
    return result;
  }

  async findByRoleId(roleId: string) {
    const result = await this.userRepository.findAll({
      $eq: { role: roleId },
    });
    return result;
  }

  async findOneByUsername<T>(
    username: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.userRepository.findOne<T>({ username }, options);
  }

  async findOneByEmail<T>(
    email: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.userRepository.findOne<T>({ email }, options);
  }

  async findOneById<T>(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.userRepository.findOneById<T>(_id, options);
  }

  async joinWithRole(repository: UserDoc): Promise<IUserDoc> {
    return repository.populate({
      path: 'role',
      localField: 'role',
      foreignField: '_id',
      model: RoleEntity.name,
    });
    // return repository.populate('role');
  }

  // Create user
  async create(
    {
      firstName,
      lastName,
      email,
      role,
      password,
      displayName,
      username,
    }: createUserDto,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc> {
    const create: UserEntity = new UserEntity();
    create.firstName = firstName;
    create.email = email;
    create.password = password;
    create.role = role;
    create.isActive = true;
    create.lastName = lastName;
    create.displayName = displayName;
    create.username = username;
    create.signUpDate = this.helperDateService.create();

    return this.userRepository.create<UserEntity>(create, options);
  }

  /**
   * Update user
   * @param id User id
   * @param dto Update user dto
   * @returns Updated user
   */
  // async update(id: string, dto: updateUserDto) {
  //   const checkExistId = await this.exists(id);
  //   if (!checkExistId) {
  //     throw new HttpException('User not found', 404);
  //   }
  //   return await this.UserModel.findByIdAndUpdate(
  //     checkExistId,
  //     {
  //       $set: {
  //         displayName: dto.displayName,
  //         firstName: dto.firstName,
  //         lastName: dto.lastName,
  //         isBanned: dto.banned,
  //         isActive: dto.isActive,
  //         isVerified: dto.isVerified,
  //         sex: dto.sex,
  //       },
  //     },
  //     {
  //       new: true,
  //     },
  //   ).exec();
  // }

  /**
   * Update user password
   * @param id User id
   * @param password New password
   * @returns Updated user
   */
  async updatePassword(
    repository: UserDoc,
    password: string,
    options?: IDatabaseSaveOptions,
  ) {
    repository.password = password;
    return this.userRepository.save(repository, options);
  }

  /**
   * Delete user
   * @param id User id
   * @returns Deleted user
   */
  async delete(repository: UserDoc, options?: IDatabaseSaveOptions) {
    return this.userRepository.softDelete(repository, options);
  }

  async payloadSerialization(
    data: IUserDoc,
  ): Promise<UserPayloadSerialization> {
    return plainToInstance(UserPayloadSerialization, data.toObject());
  }

  /**
   * Active user
   * @param id User id
   * @returns Activated user
   */
  async active(repository: UserDoc, options?: IDatabaseSaveOptions) {
    repository.isActive = true;
    return this.userRepository.save(repository, options);
  }

  /**
   * Deactive user
   * @param id User id
   * @returns Deactivated user
   */
  async inactive(repository: UserDoc, options?: IDatabaseSaveOptions) {
    repository.isActive = false;
    return this.userRepository.save(repository, options);
  }

  async verify(repository: UserDoc, options?: IDatabaseSaveOptions) {
    repository.isVerified = true;
    return this.userRepository.save(repository, options);
  }

  async ban(repository: UserDoc, options?: IDatabaseSaveOptions) {
    repository.isBanned = true;
    return this.userRepository.save(repository, options);
  }

  async unban(repository: UserDoc, options?: IDatabaseSaveOptions) {
    repository.isBanned = false;
    return this.userRepository.save(repository, options);
  }

  async disable(repository: UserDoc, options?: IDatabaseSaveOptions) {
    repository.isDisabled = true;
    return this.userRepository.save(repository, options);
  }

  async enable(repository: UserDoc, options?: IDatabaseSaveOptions) {
    repository.isDisabled = false;
    return this.userRepository.save(repository, options);
  }
}
