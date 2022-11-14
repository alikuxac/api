import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { On } from '@discord-nestjs/core';

import { StickRole } from '../entities/stickRole.entity';

import { GuildMember, Events } from 'discord.js';

@Injectable()
export class guildMemeberAddEvent {
  constructor(
    @InjectModel('StickRole', 'discordbot')
    private readonly stickRoleModel: Model<StickRole>,
  ) {}

  @On(Events.GuildMemberAdd)
  async CheckStickRole(member: GuildMember) {
    const stickRole = await this.stickRoleModel.findOne({
      guildID: member.guild.id,
      id: member.id,
    });

    // If no stick role is found, return
    if (!stickRole) return;

    // Delete document from database if that role is not found on the server
    if (!member.guild.roles.cache.has(stickRole.roleId)) {
      await this.stickRoleModel.deleteOne({
        guildID: member.guild.id,
        userId: member.id,
      });
    }
    await member.roles.add(stickRole.roleId);
  }
}
