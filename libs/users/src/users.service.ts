import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// Entity
import { User } from '@users/user.entity';

// Dto
import { createUserDto, updateUserDto } from '@users/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<User>,
  ) {}

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
    return await this.UserModel.findById(id).exec();
  }

  /**
   * Find user by username
   * @param username Username
   * @returns User
   */
  async findByUsername(username: string) {
    return await this.UserModel.findOne({ username }).exec();
  }

  /**
   * Find user by email
   * @param email Email
   * @returns User
   */
  async findByEmail(email: string) {
    return await this.UserModel.findOne({ email }).exec();
  }

  // Create user
  async create(dto: createUserDto) {
    const userExist = await this.UserModel.findOne({
      $or: [{ email: dto.email }, { username: dto.username }],
    }).exec();
    if (userExist) {
      throw new HttpException('User already exists', 409);
    }
    const user = new this.UserModel(dto);
    return await user.save();
  }

  /**
   * Update user
   * @param id User id
   * @param dto Update user dto
   * @returns Updated user
   */
  async update(id: string, dto: updateUserDto) {
    return await this.UserModel.findByIdAndUpdate(
      id,
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
}
