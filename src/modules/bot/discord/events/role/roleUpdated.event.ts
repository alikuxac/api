import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { On } from '@discord-nestjs/core';

import { StickRole } from 'src/modules/bot/discord/entities';

import { Events, Role } from 'discord.js';

@Injectable()
export class roleUpdateEvent {
  constructor(
    @InjectModel(StickRole.name, 'api')
    private readonly stickRoleModel: Model<StickRole>,
  ) {}

  @On(Events.GuildRoleUpdate)
  async updateGuildRole(oldRole: Role, newRole: Role) {
    if (oldRole.color !== newRole.color) {
      const stickRoleExists = await this.stickRoleModel
        .findOne({ roleId: newRole.id })
        .exec();
      if (stickRoleExists) {
        stickRoleExists.color = newRole.color.toString();
        await stickRoleExists.save();
      }
    }
  }
}
