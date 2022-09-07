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
  UserRolePermissionDto,
} from '@users/dto';

// Enum
import { UserRolePermission } from '@users/enum';

// Service
import { RedisService } from '@shared/redis/redis.service';

@Injectable()
export class UserRoleService {
  private readonly baseKey = 'userRole_';
  private readonly defaultRole = ['user'];
  private readonly rolePermissionArray = Object.values(UserRolePermission);

  constructor(
    @InjectModel(UserRole.name, 'api')
    private readonly userRoleModel: Model<UserRole>,
    @InjectModel(User.name, 'api')
    private readonly usersModel: Model<User>,
    private readonly redisService: RedisService,
  ) {}

  async getUserRole() {
    return await this.userRoleModel.findOne({ name: 'user' }).exec();
  }

  async init() {
    const userRoles = await this.findAll();
    if (userRoles.length === 0) {
      const user = new this.userRoleModel({
        name: 'user',
        description: 'User',
        position: 0,
        permissions: [],
      });
      return await user.save();
    } else {
      userRoles.forEach(async (role) => {
        role.permissions = role.permissions.filter((permission) => {
          return this.rolePermissionArray.includes(permission);
        });
        await role.save();
      });
    }
  }

  async count() {
    const countKey = `${this.baseKey}count`;
    const count = await this.redisService.get(countKey);
    if (count) {
      return +count;
    }
    const result = await this.userRoleModel.countDocuments().exec();
    await this.redisService.set(countKey, result.toString());
    return result;
  }

  async findAll() {
    const findAllKey = `${this.baseKey}findAll`;
    const roles = await this.redisService.get(findAllKey);
    if (roles) {
      return JSON.parse(roles) as UserRole[];
    }
    const result = await this.userRoleModel.find().exec();
    await this.redisService.set(findAllKey, JSON.stringify(result));
    return result;
  }

  async findOne(id: string) {
    const findOneKey = `${this.baseKey}findOne_${id}`;
    const role = await this.redisService.get(findOneKey);
    if (role) {
      return JSON.parse(role) as UserRole;
    }
    const result = await this.userRoleModel.findById(id).exec();
    await this.redisService.set(findOneKey, JSON.stringify(result));
    return result;
  }

  async findOneByName(name: string) {
    const findOneByNameKey = `${this.baseKey}findOneByName_${name}`;
    const role = await this.redisService.get(findOneByNameKey);
    if (role) {
      return JSON.parse(role) as UserRole;
    }
    const result = await this.userRoleModel.findOne({ name }).exec();
    await this.redisService.set(findOneByNameKey, JSON.stringify(result));
    return result;
  }

  async create(dto: createUserRoleDto) {
    if (this.defaultRole.includes(dto.name.replace(/ /g, '_').toLowerCase())) {
      throw new ConflictException('You cant create a reserved role');
    }
    const existRole = await this.findOneByName(dto.name);
    if (existRole) {
      throw new ConflictException('Role already exist');
    }
    const userRole = new this.userRoleModel({ ...dto });
    const latestRole = await this.userRoleModel
      .findOne({})
      .sort({ position: -1 })
      .lean()
      .exec();
    userRole.position = latestRole?.position ? latestRole.position + 1 : 1;
    return await userRole.save();
  }

  async update(id: string, dto: updateUserRoleDto) {
    if (this.defaultRole.includes(dto.name.replace(/ /g, '_').toLowerCase())) {
      throw new ConflictException('You cant update default role');
    }
    const role = await this.userRoleModel.findById(id).exec();
    if (!role) {
      throw new HttpException('User role not found', 404);
    }
    if (dto.position !== undefined) {
      const latestPosition = await this.userRoleModel
        .findOne({})
        .sort({ position: -1 })
        .lean()
        .exec();
      if (dto.position > latestPosition.position) {
        throw new ConflictException('Position can not be greater than latest');
      }
      const swapRole = await this.userRoleModel
        .findOne({ position: dto.position })
        .exec();
      if (swapRole) {
        swapRole.position = role.position;
        role.position = swapRole.position;
        this.userRoleModel.startSession();
        await Promise.all([await swapRole.save(), await role.save()]);
      } else {
        role.position = dto.position;
      }
    }

    await role.save();
    return role;
  }

  async delete(name: string) {
    const userRole = await this.findOneByName(name);
    if (!userRole) {
      throw new HttpException('User role not found', 404);
    }
    await this.userRoleModel.findByIdAndDelete(userRole._id);
    await this.redisService.del(`${this.baseKey}findOneByName_${name}`);
    const defaultUserRole = await this.getUserRole();
    return await this.usersModel.updateMany(
      { role: userRole._id },
      { $set: { role: defaultUserRole } },
    );
  }

  async addPermission(id: string, dto: UserRolePermissionDto, user: User) {
    const userRole = await this.findOne(user.role.toString());
    const role = await this.findOne(id);
    if (!role) {
      throw new HttpException('User role not found', 404);
    }
    const userHasPermission = userRole.permissions.includes(dto.action);
    if (!userHasPermission && !user.isOwner) {
      throw new HttpException(
        'You dont have permission to add this permission',
        403,
      );
    }
    if (role.permissions.includes(dto.action)) {
      throw new HttpException('Permission already exist', 409);
    } else {
      role.permissions.push(dto.action);
      await role.save();
    }
  }

  async addAllPermissions(id: string) {
    const role = await this.findOne(id);
    if (!role) {
      throw new HttpException('Role not found', 404);
    }
    role.permissions = this.rolePermissionArray;
    return await role.save();
  }

  async removePermission(id: string, dto: removeRolePermissionDto, user: User) {
    const userRole = await this.findOne(user.role.toString());
    const role = await this.findOne(id);
    if (!role) {
      throw new HttpException('User role not found', 404);
    }
    const userHasPermission = userRole.permissions.includes(dto.action);
    if (!userHasPermission && !user.isOwner) {
      throw new HttpException(
        'You dont have permission to remove this permission',
        403,
      );
    }
    if (role.permissions.includes(dto.action)) {
      role.permissions.splice(role.permissions.indexOf(dto.action), 1);
      return await role.save();
    } else {
      throw new HttpException('Permission not found', 404);
    }
  }

  async removeAllPermissions(id: string) {
    const role = await this.findOne(id);
    if (!role) {
      throw new HttpException('Role not found', 404);
    }
    role.permissions = [];
    return await role.save();
  }

  async getPermissions(id: string) {
    const userRole = await this.findOne(id);
    if (!userRole) {
      throw new HttpException('Role not found', 404);
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
