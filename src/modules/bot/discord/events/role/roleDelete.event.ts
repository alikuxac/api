import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { On } from '@discord-nestjs/core';

import { StickRole } from '@discord/entities';

import { Events, Role } from 'discord.js';

@Injectable()
export class roleDeleteEvent {
  constructor(
    @InjectModel(StickRole.name, 'api')
    private readonly stickRoleModel: Model<StickRole>,
  ) {}

  @On(Events.GuildRoleDelete)
  async roleDelete(role: Role) {
    const stickRoleExist = await this.stickRoleModel
      .findOne({
        roleId: role.id,
      })
      .exec();
    if (stickRoleExist) {
      await this.stickRoleModel.deleteOne({ roleId: role.id });
    }
  }
}
