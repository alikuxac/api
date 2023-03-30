import {
  SubCommand,
  IA,
  InteractionEvent,
  Handler,
} from '@discord-nestjs/core';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { StickRole } from 'src/modules/bot/discord/entities';
import { AddStickRoleDto } from 'src/modules/bot/discord/dto/stickRole.dto';
import { CommandInteraction } from 'discord.js';

@SubCommand({
  name: 'addsStickRole',
  description: 'Stick a role to a user',
})
export class AddStickRoleCommand {
  constructor(
    @InjectModel(StickRole.name, 'api')
    private readonly stickRoleModel: Model<StickRole>,
  ) {}

  @Handler()
  async handler(
    @InteractionEvent(SlashCommandPipe) dto: AddStickRoleDto,
    @IA() interaction: CommandInteraction,
  ) {
    const { role: roleToAdd, user: userToAdd } = dto;
    const checkExist = await this.stickRoleModel
      .findOne({
        user: userToAdd.id,
        roleId: roleToAdd.id,
      })
      .exec();
    if (checkExist) {
      await interaction.reply({
        content: `This user already has stick role`,
        ephemeral: true,
      });
      return;
    }

    const stickRole = new this.stickRoleModel({
      user: userToAdd.id,
      roleId: roleToAdd.id,
    });

    await stickRole.save();
    await interaction.reply({
      content: `Role ${roleToAdd.name} has been added to ${userToAdd.username}`,
      ephemeral: true,
    });
  }
}
