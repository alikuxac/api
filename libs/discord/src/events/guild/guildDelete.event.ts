import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { On } from '@discord-nestjs/core';

import { StickRole, DiscordGuild } from '@discord/entities/';

import { Guild, Events } from 'discord.js';

@Injectable()
export class guildDeleteEvent {
  constructor(
    @InjectModel(StickRole.name, 'api')
    private readonly stickRoleModel: Model<StickRole>,
    @InjectModel(DiscordGuild.name, 'api')
    private readonly discordGuildModel: Model<DiscordGuild>,
  ) {}

  @On(Events.GuildDelete)
  async toggleLeft(guild: Guild) {
    const guildExist = await this.discordGuildModel
      .findOne({
        guildId: guild.id,
      })
      .exec();

    if (guildExist) {
      guildExist.isLeft = true;
      guildExist.leftDate = new Date();
      await guildExist.save();
    } else {
      const newGuild = new this.discordGuildModel({
        guildId: guild.id,
        isLeft: true,
        leftDate: new Date(),
      });
      await newGuild.save();
    }
  }
}
