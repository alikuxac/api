import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  OnModuleInit,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  createRoleDto,
  updateRoleDto,
  updateRolePermissionDto,
} from '../dto/roles.dto';

import { Role } from '../entities/roles.entity';
import { User } from 'src/modules/api/users/entities/user.entity';

import { RedisService } from 'src/common/database/services/redis.service';

@Injectable()
export class RolesService implements OnModuleInit {
  private readonly baseKey = 'role_';
  private readonly defaultRole = ['admin', 'user'];
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectModel(Role.name, 'api')
    private readonly roleModel: Model<Role>,
    @InjectModel(User.name, 'api')
    private readonly userModel: Model<User>,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    this.logger.log('Role Service Init');
    for (let i = 0; i < this.defaultRole.length; i++) {
      const role = this.defaultRole[i];
      const roleFound = await this.roleModel.findOne({ name: role }).exec();
      if (roleFound) {
        continue;
      }
      const newRole = new this.roleModel({
        name: role,
        description: 'User',
        position: 0,
        permissions: [],
      });
      await newRole.save();
    }
  }

  async getDefaultRole() {
    const result = await this.roleModel
      .find({ name: { $in: this.defaultRole } })
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
    if (this.defaultRole.includes(dto.name)) {
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
    const userRoleCount = await this.userModel.find({ role: role._id }).exec();
    if (userRoleCount.length > 0) {
      throw new BadRequestException(
        'This role still have users. Please update user role before delete.',
      );
    }
    return await this.roleModel.deleteOne({ _id: id }).exec();
  }

  async updatePermsission(id: string, dto: updateRolePermissionDto) {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    role.permissions = dto.permissions;
    return await role.save();
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
