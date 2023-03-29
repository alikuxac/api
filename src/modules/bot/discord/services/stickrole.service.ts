import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { StickRole } from '@discord/entities';
import { getAllStickRoleDto } from '@discord/dto/';

@Injectable()
export class StickRoleService {
  constructor(
    @InjectModel(StickRole.name, 'api')
    private readonly stickRoleModel: Model<StickRole>,
  ) {}

  async findAll(dto: getAllStickRoleDto) {
    const { limit, page } = dto;
    const getStickRoles = await this.stickRoleModel
      .find()
      .limit(limit ?? 10)
      .skip(page ? page * 10 : 0)
      .exec();
    if (getStickRoles.length === 0)
      throw new NotFoundException('No stick role found');
    return getStickRoles.map((role) => {
      return {
        guild: role.guildId,
        user: role.userId,
        role: role.roleId,
      };
    });
  }

  async getRoleByGuild(guildId: string) {
    const guildStickRoles = await this.stickRoleModel.find({
      guildId: guildId,
    });
    if (guildStickRoles.length === 0)
      throw new NotFoundException('No role found for guild');
    return guildStickRoles.map((role) => {
      return {
        guild: role.guildId,
        user: role.userId,
        role: role.roleId,
      };
    });
  }

  async getRoleByUser(userId: string) {
    const userStickRoles = await this.stickRoleModel.find({
      userId: userId,
    });
    if (userStickRoles.length === 0)
      throw new NotFoundException('No role found for this user');
    return userStickRoles.map((role) => {
      return {
        guild: role.guildId,
        user: role.userId,
        role: role.roleId,
      };
    });
  }
}
