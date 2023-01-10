import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
    const result = await this.roleModel
      .findOne({ name: this.defaultRole[0] })
      .exec();
    return result;
  }

  async getHighestPosition() {
    const position = await this.redisService.get(`${this.baseKey}position`);
    if (position) {
      return +position;
    }
    const latestRole = await this.roleModel
      .findOne({})
      .sort({ position: -1 })
      .lean()
      .exec();
    await this.redisService.set(
      `${this.baseKey}position`,
      latestRole.position.toString(),
    );
    return latestRole.position;
  }

  async init() {
    const userRole = await this.roleModel
      .findOne({ name: this.defaultRole[0] })
      .exec();
    if (!userRole) {
      const role = new this.roleModel({
        name: 'user',
        description: 'User',
        position: 0,
        permissions: [],
      });
      return await role.save();
    }
    return userRole;
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
    const role = new this.roleModel({
      name: dto.name,
      description: dto.description ?? '',
      permissions: dto.permissions ?? [],
    });
    const latestRole = await this.roleModel
      .findOne({})
      .sort({ position: -1 })
      .lean()
      .exec();
    role.position = latestRole.position ? latestRole.position + 1 : 1;
    return await role.save();
  }

  async findAll(page = 0) {
    const limit = 10;
    const result = await this.roleModel
      .find()
      .limit(limit)
      .skip(limit * page)
      .exec();
    return result;
  }

  async findOne(id: string) {
    const result = await this.roleModel.findById(id).exec();
    return result;
  }

  async findOneByName(name: string) {
    const roleExist = await this.roleModel.findOne({ name: name }).exec();
    if (!roleExist) {
      throw new NotFoundException('No role with this name');
    }
    return { role: roleExist };
  }

  async update(id: string, dto: updateRoleDto) {
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

  async remove(id: string) {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    const userCount = await this.userModel.find({ role: role._id }).exec();
    if (userCount.length > 0) {
      throw new BadRequestException('Users that have role are more than 1.');
    }
    return await this.roleModel.deleteOne({ _id: id }).exec();
  }

  async swapRole(user: User, id: string, position: number) {
    const userRole = await this.roleModel.findById(user.role).exec();
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    const roleWithPosition = await this.roleModel.findOne({ position }).exec();
    if (!roleWithPosition) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    if (
      !user.isOwner &&
      (userRole.position < role.position ||
        userRole.position < roleWithPosition.position)
    ) {
      throw new BadRequestException('You dont have permission to do this');
    }
    const temp = role.position;
    role.position = roleWithPosition.position;
    roleWithPosition.position = temp;
    await role.save();
    await roleWithPosition.save();
    return { role, roleWithPosition };
  }
}
