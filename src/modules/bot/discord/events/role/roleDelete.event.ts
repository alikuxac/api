import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { On } from '@discord-nestjs/core';

import { StickRole } from 'src/modules/bot/discord/entities';

import { Events, Role } from 'discord.js';

@Injectable()
export class roleDeleteEvent {
  constructor(
    @InjectModel(StickRole.name, 'api')
    private readonly stickRoleModel: Model<StickRole>,
  ) {}

  @On(Events.GuildRoleDelete)
  async roleDelete(role: Role) {
    await this.stickRoleModel
      .findOneAndDelete({
        roleId: role.id,
      })
      .exec();
  }
}
