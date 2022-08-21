import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';

// Entity
import { User } from '@users/entities';

// Dto
import { createUserDto, updateUserDto, providerDto } from '@users/dto/user.dto';

// Enum
import { UserSex } from '@users/enum/sex.enum';

// Service
import { UserRoleService } from '@users/services';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<User>,
    private readonly userRoleService: UserRoleService,
    private readonly configService: ConfigService,
  ) {}

  async init() {
    const users = await this.findAll();
    const adminRole = await this.userRoleService.getAdminRole();
    if (users.length === 0) {
      const admin = new this.UserModel({
        username: 'admin',
        password: this.configService.get('ADMIN_PASSWORD'),
        email: this.configService.get('ADMIN_EMAIL'),
        displayName: 'Admin',
        firstName: 'Admin',
        lastName: 'Admin',
        isActive: true,
        isVerified: true,
        role: adminRole,
        sex: UserSex.UNKNOWN,
      });
      return await admin.save();
    }
  }

  // Check if user exists
  async exists(id: string) {
    return await this.UserModel.exists({ _id: id });
  }

  /**
   * Find all
   * @returns Users
   */
  async findAll() {
    return await this.UserModel.find().exec();
  }

  /**
   * Find user by Id
   * @param id User id
   * @returns User
   */
  async findOne(id: string) {
    const checkExistId = await this.exists(id);
    if (!checkExistId) {
      throw new HttpException('User not found', 404);
    }
    return await this.UserModel.findById(checkExistId).exec();
  }

  /**
   * Find user by username
   * @param username Username
   * @returns User
   */
  async findByUsername(username: string) {
    return await this.UserModel.findOne({
      username: username.toLowerCase(),
    }).exec();
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
    return await this.UserModel.findOne({ email }).exec();
  }

  /**
   *
   * @param provider Provider name
   * @param id provider id
   * @returns
   */
  async findByProviderId(provider: string, id: string) {
    return await this.UserModel.findOne({
      providers: {
        $elemMatch: {
          provider,
          providerId: id,
        },
      },
    }).exec();
  }

  // Create user
  async create(dto: createUserDto) {
    const userExist = await this.UserModel.findOne({
      $or: [{ email: dto.email }, { username: dto.username }],
    }).exec();
    if (userExist) {
      throw new HttpException('User already exists', 409);
    }
    const roleName = dto.role ?? 'user';
    const userRole = this.userRoleService.findOneByName(roleName);
    if (!userRole) {
      throw new HttpException('User role not found', 404);
    }
    delete dto.role; // Remove role from dto
    const user = new this.UserModel({ ...dto, role: userRole });
    return await user.save();
  }

  /**
   * Update user
   * @param id User id
   * @param dto Update user dto
   * @returns Updated user
   */
  async update(id: string, dto: updateUserDto) {
    const checkExistId = await this.exists(id);
    if (!checkExistId) {
      throw new HttpException('User not found', 404);
    }
    return await this.UserModel.findByIdAndUpdate(
      checkExistId,
      {
        $set: {
          displayName: dto.displayName,
          firstName: dto.firstName,
          lastName: dto.lastName,
          banned: dto.banned,
          isActive: dto.isActive,
          isVerified: dto.isVerified,
          sex: dto.sex,
        },
      },
      {
        new: true,
      },
    ).exec();
  }

  /**
   * Update user password
   * @param id User id
   * @param password New password
   * @returns Updated user
   */
  async changePasswordUser(id: string, password: string) {
    const checkExistId = await this.exists(id);
    if (!checkExistId) {
      throw new HttpException('User not found', 404);
    }
    return await this.UserModel.findByIdAndUpdate(id, {
      $set: {
        password,
      },
    }).exec();
  }

  /**
   * Delete user
   * @param id User id
   * @returns Deleted user
   */
  async removeUser(id: string) {
    return await this.UserModel.findByIdAndRemove(id).exec();
  }

  /**
   * Active user
   * @param id User id
   * @returns Activated user
   */
  async activeUser(id: string) {
    return await this.UserModel.findByIdAndUpdate(id, {
      $set: {
        isActive: true,
      },
    }).exec();
  }

  /**
   * Deactive user
   * @param id User id
   * @returns Deactivated user
   */
  async deactiveUser(id: string) {
    return await this.UserModel.findByIdAndUpdate(id, {
      $set: {
        isActive: false,
      },
    }).exec();
  }

  /**
   * Verify user
   * @param id User id
   * @returns Verified user
   */
  async verifyUser(id: string) {
    return await this.UserModel.findByIdAndUpdate(id, {
      $set: {
        isVerified: true,
      },
    }).exec();
  }

  /**
   * Ban user
   * @param id User id
   * @returns Banned user
   */
  async banUser(id: string) {
    return await this.UserModel.findByIdAndUpdate(id, {
      $set: {
        banned: true,
      },
    }).exec();
  }

  /**
   *
   * @param id User id
   * @param dto Provider dto
   * @returns
   */
  async linkUser(id: string, dto: providerDto) {
    const checkExistId = await this.exists(id);
    if (!checkExistId) {
      throw new HttpException('User not found', 404);
    }
    return await this.UserModel.findByIdAndUpdate(id, {
      $push: {
        providers: {
          provider: dto.provider,
          providerId: dto.providerId,
          name: dto.name,
        },
      },
    }).exec();
  }

  /**
   * @param id User id
   * @param provider Provider name
   * @returns
   */
  async unlinkUser(id: string, provider: string) {
    const checkExistId = await this.exists(id);
    if (!checkExistId) {
      throw new HttpException('User not found', 404);
    }
    const checkProvider = await this.UserModel.findById(id).exec();
    if (checkProvider.providers.length === 0) {
      throw new HttpException('No provider found', 404);
    } else {
      return await this.UserModel.findByIdAndUpdate(id, {
        $pull: {
          providers: {
            provider,
          },
        },
      }).exec();
    }
  }

  /**
   * @param id User id
   * @param roleName Role name
   * @returns
   */
  async setRole(id: string, roleName: string) {
    const checkExistId = await this.exists(id);
    if (!checkExistId) {
      throw new HttpException('User not found', 404);
    }
    const roleExist = await this.userRoleService.findOneByName(roleName);
    if (!roleExist) {
      throw new HttpException('Role not found', 404);
    }
    return await this.UserModel.findByIdAndUpdate(id, {
      $set: {
        role: roleExist,
      },
    }).exec();
  }

  /**
   *
   * @param id
   * @returns
   */
  async disableUser(id: string) {
    return await this.UserModel.findByIdAndUpdate(id, {
      $set: {
        isDisabled: true,
      },
    }).exec();
  }

  /**
   * @param id User id
   * @returns
   */
  async enableUser(id: string) {
    return await this.UserModel.findByIdAndUpdate(id, {
      $set: {
        isDisabled: false,
      },
    }).exec();
  }
}
