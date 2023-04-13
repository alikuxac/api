import {
  Injectable,
  HttpException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { isEmail } from 'class-validator';

// Entity
import { User } from 'src/modules/api/users/entities/user.entity';

// Dto
import {
  createUserDto,
  updateUserDto,
} from 'src/modules/api/users/dto/user.dto';

// Enum
import { UserSex } from 'src/modules/api/users/constants/user.constant';

// Service
import { Role } from 'src/common/roles/entities/roles.entity';
@Injectable()
export class UsersService implements OnModuleInit {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(Role.name, 'api')
    private readonly roleModel: Model<Role>,
    @InjectModel(User.name, 'api')
    private readonly UserModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log('User Service Init');
    // this.logger.log(this.configService.get('auth'));
    const role = await this.roleModel.findOne({ name: 'user' }).exec();
    const users = await this.findAll();
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
        role,
        sex: UserSex.UNKNOWN,
      });
      await admin.save();
    }
  }

  // Check if user exists
  async exists(id: string) {
    return await this.UserModel.exists({ _id: id }).exec();
  }

  async getTotalUsers() {
    return await this.UserModel.countDocuments().exec();
  }

  async validateWithEmail(email: string) {
    const user = await this.UserModel.findOne({ email }).exec();
    return user;
  }

  /**
   * Find all
   * @returns Users
   */
  async findAll(limit = 10, page = 0) {
    return await this.UserModel.find()
      .limit(limit)
      .skip(page * limit)
      .exec();
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
      user.populate({ path: 'role', model: Role.name });
    }
    const result = await user.exec();
    return result;
  }

  /**
   * Find user by username
   * @param username Username
   * @returns User
   */
  async findByUsername(username: string) {
    const result = await this.UserModel.findOne({
      username: username.toLowerCase(),
    })
      .populate({ path: 'role', model: Role.name })
      .exec();
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
    const result = await this.UserModel.findOne({ email })
      .populate('role')
      .exec();
    return result;
  }

  async findByUsernameOrEmail(value: string) {
    const result = await this.UserModel.findOne({
      $or: [{ username: value }, { email: value }],
    })
      .populate('role')
      .exec();
    return result;
  }

  async findByRoleId(roleId: string) {
    const result = await this.UserModel.find({
      $eq: { role: roleId },
    }).exec();
    return result;
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
    const role = await this.roleModel.findOne({ name: roleName });
    if (!role) {
      throw new HttpException('User role not found', 404);
    }
    delete dto.role; // Remove role from dto
    const user = new this.UserModel({ ...dto, role: role._id });
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
          isBanned: dto.banned,
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
