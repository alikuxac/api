import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// Entity
import { UserRole, User } from '@users/entities';

// Dto
import {
  createUserRoleDto,
  removeRolePermissionDto,
  updateUserRoleDto,
  updateUserRolePermissionDto,
} from '@users/dto';

// Enum
import { UserRolePermission } from '@users/enum';

@Injectable()
export class UserRoleService {
  private readonly defaultRole = ['admin', 'user'];
  private readonly rolePermissionArray = Object.values(UserRolePermission);

  constructor(
    @InjectModel(UserRole.name)
    private readonly userRoleModel: Model<UserRole>,
    @InjectModel(User.name)
    private readonly usersModel: Model<User>,
  ) {}

  async getAdminRole() {
    return await this.userRoleModel.findOne({ name: 'admin' }).exec();
  }

  async getUserRole() {
    return await this.userRoleModel.findOne({ name: 'user' }).exec();
  }

  async init() {
    const userRoles = await this.findAll();
    if (userRoles.length === 0) {
      const admin = new this.userRoleModel({
        name: 'admin',
        description: 'Admin',
        permissions: [
          {
            action: UserRolePermission.Manage,
            allowed: true,
            restricted: false,
          },
        ],
      });
      const user = new this.userRoleModel({
        name: 'user',
        description: 'User',
        permissions: [],
      });
      await admin.save();
      await user.save();
    } else {
      userRoles.forEach(async (role) => {
        role.permissions = role.permissions.filter((permission) => {
          return this.rolePermissionArray.includes(permission.action);
        });
        await role.save();
      });
    }
  }

  async count() {
    return await this.userRoleModel.countDocuments().exec();
  }

  async findAll() {
    return await this.userRoleModel.find().exec();
  }

  async findOne(id: string) {
    return await this.userRoleModel.findById(id).exec();
  }

  async findOneByName(name: string) {
    return await this.userRoleModel.findOne({ name }).exec();
  }

  async create(dto: createUserRoleDto) {
    if (this.defaultRole.includes(dto.name.replace(/ /g, '_').toLowerCase())) {
      throw new ConflictException('You cant create a reserved role');
    }
    const userRole = new this.userRoleModel({ ...dto });
    return await userRole.save();
  }

  async update(id: string, dto: updateUserRoleDto) {
    if (this.defaultRole.includes(dto.name.replace(/ /g, '_').toLowerCase())) {
      throw new ConflictException('You cant update default role');
    }
    const userRole = await this.findOneByName(dto.name);
    if (!userRole) {
      throw new HttpException('User role not found', 404);
    }
    return await this.userRoleModel.findByIdAndUpdate(
      id,
      { $set: { description: dto.description } },
      { new: true },
    );
  }

  async delete(name: string) {
    const userRole = await this.findOneByName(name);
    if (!userRole) {
      throw new HttpException('User role not found', 404);
    }
    await this.userRoleModel.findByIdAndDelete(userRole._id);

    const defaultUserRole = await this.getUserRole();
    return await this.usersModel.updateMany(
      { 'role._id': userRole._id },
      { $set: { role: defaultUserRole } },
    );
  }

  async addPermission(id: string, dto: updateUserRolePermissionDto) {
    const userRole = await this.findOne(id);
    if (!userRole) {
      throw new HttpException('User role not found', 404);
    }
    const existPermission = userRole.permissions.find(
      (permission) => permission.action === dto.action,
    );
    if (existPermission) {
      throw new ConflictException('Permission already exist');
    }
    userRole.permissions.push(dto);
    return await userRole.save();
  }

  async removePermission(id: string, dto: removeRolePermissionDto) {
    const userRole = await this.findOne(id);
    if (!userRole) {
      throw new HttpException('User role not found', 404);
    }
    const existPermission = userRole.permissions.find(
      (permission) => permission.action === dto.action,
    );
    if (existPermission) {
      userRole.permissions.splice(
        userRole.permissions.indexOf(existPermission),
        1,
      );
    }
    return await userRole.save();
  }

  async getPermissions(id: string) {
    const userRole = await this.findOne(id);
    if (!userRole) {
      throw new HttpException('User role not found', 404);
    }
    return userRole.permissions;
  }

  async getPermissionByName(name: string) {
    const userRole = await this.findOneByName(name);
    if (!userRole) {
      throw new HttpException('User role not found', 404);
    }
    return userRole.permissions;
  }
}
