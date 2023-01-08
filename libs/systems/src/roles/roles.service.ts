import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { createRoleDto, updateRoleDto } from './roles.dto';

import { Role } from './roles.entity';
import { User } from '@users/entities';

import { RedisService } from '@shared/redis/redis.service';

@Injectable()
export class RolesService {
  private readonly baseKey = 'role_';
  private readonly defaultRole = ['user'];

  constructor(
    @InjectModel(Role.name, 'api')
    private readonly roleModel: Model<Role>,
    @InjectModel(User.name, 'api')
    private readonly userModel: Model<User>,
    private readonly redisService: RedisService,
  ) {}

  async getUserRole() {
    const userRoleKey = `${this.baseKey}userRole`;
    const role = await this.redisService.get(userRoleKey);
    if (role) {
      return JSON.parse(role) as Role;
    }
    const result = await this.roleModel
      .findOne({ name: this.defaultRole[0] })
      .exec();
    await this.redisService.set(userRoleKey, JSON.stringify(result));
    return result;
  }

  async init() {
    const roleArray = await this.roleModel.find().exec();
    if (roleArray.length === 0) {
      const role = new this.roleModel({
        name: 'user',
        description: 'User',
        position: 0,
        permissions: [],
      });
      return await role.save();
    }
  }

  async create(dto: createRoleDto) {
    if (dto.name === this.defaultRole[0]) {
      throw new HttpException(
        'Role name is already taken',
        HttpStatus.BAD_REQUEST,
      );
    }
    const existRole = await this.roleModel.findOne({ name: dto.name }).exec();
    if (existRole) {
      throw new HttpException(
        'Role name is already taken',
        HttpStatus.BAD_REQUEST,
      );
    }
    const role = new this.roleModel({ ...dto });
    const latestRole = await this.roleModel
      .findOne({})
      .sort({ position: -1 })
      .lean()
      .exec();
    role.position = latestRole.position ? latestRole.position + 1 : 1;
    return await role.save();
  }

  async findAll() {
    const findAllKey = `${this.baseKey}findAll`;
    const roles = await this.redisService.get(findAllKey);
    if (roles) {
      return JSON.parse(roles) as Role[];
    }
    const result = await this.roleModel.find().exec();
    await this.redisService.set(findAllKey, JSON.stringify(result));
    return result;
  }

  async findOne(id: string) {
    const findOneKey = `${this.baseKey}findOne_${id}`;
    const role = await this.redisService.get(findOneKey);
    if (role) {
      return JSON.parse(role) as Role;
    }
    const result = await this.roleModel.findById(id).exec();
    await this.redisService.set(findOneKey, JSON.stringify(result));
    return result;
  }

  async update(id: number, dto: updateRoleDto) {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    if (dto.name === this.defaultRole[0]) {
      throw new HttpException(
        'Role name is already taken',
        HttpStatus.BAD_REQUEST,
      );
    }
    const existRoleWithName = await this.roleModel
      .findOne({ name: dto.name })
      .exec();
    if (existRoleWithName && existRoleWithName._id.toString() !== id) {
      throw new HttpException(
        'Role name is already taken',
        HttpStatus.BAD_REQUEST,
      );
    }
    role.name = dto.name;
    if (dto.description && dto.description !== role.description) {
      role.description = dto.description;
    }
    return await role.save();
  }

  async remove(id: number) {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    const userRole = await this.getUserRole();
    return await this.userModel.updateMany(
      { role: role._id },
      { role: userRole._id },
    );
  }

  async swapRole(id: string, position: number) {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    const roleWithPosition = await this.roleModel.findOne({ position }).exec();
    if (!roleWithPosition) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    const temp = role.position;
    role.position = roleWithPosition.position;
    roleWithPosition.position = temp;
    await role.save();
    await roleWithPosition.save();
    return { role, roleWithPosition };
  }
}
