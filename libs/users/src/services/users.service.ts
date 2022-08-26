import { Injectable, HttpException, forwardRef, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import { customAlphabet } from 'nanoid';

// Entity
import { User, UserRole } from '@users/entities';

// Dto
import { createUserDto, updateUserDto, providerDto } from '@users/dto/user.dto';
import { createUserApiKeyDto } from '@users/dto/user_apikey.dto';

// Enum
import { UserSex } from '@users/enum/sex.enum';

// Service
import { UserRoleService } from '@users/services';

@Injectable()
export class UsersService {
  private nanoid = (size = 20) =>
    customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', size);

  constructor(
    @InjectModel(User.name, 'api')
    private readonly UserModel: Model<User>,
    @Inject(forwardRef(() => UserRoleService))
    private readonly userRoleService: UserRoleService,
    private readonly configService: ConfigService,
  ) {}

  async init() {
    const users = await this.findAll();
    const userRole = await this.userRoleService.getUserRole();
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
        isOwner: true,
        role: userRole._id,
        sex: UserSex.UNKNOWN,
      });
      return await admin.save();
    }
  }

  // Check if user exists
  async exists(id: string) {
    return await this.UserModel.exists({ _id: id });
  }

  async getTotalUsers() {
    return await this.UserModel.countDocuments().exec();
  }

  async validateWithEmail(email: string) {
    return await this.UserModel.findOne({ email }).exec();
  }

  /**
   * Find all
   * @returns Users
   */
  async findAll() {
    return await this.UserModel.find()
      .populate({ path: 'role', model: UserRole.name })
      .lean();
  }

  /**
   * Find user by Id
   * @param id User id
   * @returns User
   */
  async findOne(id: string, full?: boolean) {
    const checkExistId = await this.exists(id);
    if (!checkExistId) {
      throw new HttpException('User not found', 404);
    }
    const user = this.UserModel.findOne({ _id: id });
    if (full) {
      user.populate({ path: 'role', model: UserRole.name });
    }
    return await user.lean();
  }

  /**
   * Find user by username
   * @param username Username
   * @returns User
   */
  async findByUsername(username: string) {
    return await this.UserModel.findOne({
      username: username.toLowerCase(),
    })
      .populate({ path: 'role', model: UserRole.name })
      .lean();
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
    return await this.UserModel.findOne({ email })
      .populate({ path: 'role', model: UserRole.name })
      .lean();
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
    })
      .populate({ path: 'role', model: UserRole.name })
      .lean();
  }

  async findByApiKey(apiKey: string) {
    return await this.UserModel.findOne({
      apikeys: {
        $elemMatch: {
          value: apiKey,
        },
      },
    })
      .populate({ path: 'role', model: UserRole.name })
      .lean();
  }

  async findByUsernameOrEmail(value: string) {
    return await this.UserModel.findOne({
      $or: [{ username: value }, { email: value }],
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
    const userRole = await this.userRoleService.findOneByName(roleName);
    if (!userRole) {
      throw new HttpException('User role not found', 404);
    }
    delete dto.role; // Remove role from dto
    const user = new this.UserModel({ ...dto, role: userRole._id });
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
  async setRole(id: string, roleName: string, user: User) {
    const userExist = await this.findOne(id);
    if (!userExist) {
      throw new HttpException('User not found', 404);
    }
    const userRole = await this.userRoleService.findOne(user.role.toString());
    const roleExist = await this.userRoleService.findOneByName(roleName);
    if (!roleExist) {
      throw new HttpException('Role not found', 404);
    }
    if (roleExist.position > userRole.position) {
      throw new HttpException(
        'You can not set this role because you are not high enough',
        403,
      );
    }
    userExist.role = roleExist._id;
    return await this.UserModel.findByIdAndUpdate(id, {
      $set: {
        role: roleExist._id,
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

  // APikey
  async findApiKeyByName(id: string, name: string) {
    return await this.UserModel.findOne({
      _id: id,
      apikeys: { $elemMatch: { name } },
    }).exec();
  }

  async createApiKey(id: string, dto: createUserApiKeyDto) {
    const checkExistId = await this.exists(id);
    if (!checkExistId) {
      throw new HttpException('User not found', 404);
    }
    const user = await this.UserModel.findById(id).exec();
    const checkApiKey = user.apikeys.find((apikey) => apikey.name === dto.name);
    if (checkApiKey) {
      throw new HttpException('ApiKey with name already exist', 409);
    }
    const value = 'ali_' + this.nanoid(20);
    return await this.UserModel.findByIdAndUpdate(id, {
      $push: {
        apikeys: {
          name: dto.name,
          description: dto.description ?? '',
          value,
        },
      },
    }).exec();
  }

  async createOwnApiKey(dto: createUserApiKeyDto, user: User) {
    const checkApiKey = user.apikeys.find((apikey) => apikey.name === dto.name);
    if (checkApiKey) {
      throw new HttpException('ApiKey with name already exist', 409);
    }
    const value = 'ali_' + this.nanoid(20);
    return await this.UserModel.findByIdAndUpdate(user._id, {
      $push: {
        apikeys: {
          name: dto.name,
          description: dto.description ?? '',
          value,
        },
      },
    }).exec();
  }

  async deleteApiKey(id: string, value: string) {
    const checkExistId = await this.exists(id);
    if (!checkExistId) {
      throw new HttpException('User not found', 404);
    }
    return await this.UserModel.findByIdAndUpdate(id, {
      $pull: {
        apikeys: {
          value,
        },
      },
    }).exec();
  }
}
