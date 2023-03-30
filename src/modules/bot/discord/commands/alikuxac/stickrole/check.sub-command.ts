import {
  SubCommand,
  InteractionEvent,
  Handler,
  IA,
} from '@discord-nestjs/core';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { StickRole } from 'src/modules/bot/discord/entities';
import { checkStickRoleDto } from 'src/modules/bot/discord/dto/stickRole.dto';
import { CommandInteraction } from 'discord.js';

@SubCommand({
  name: 'addsStickRole',
  description: 'Stick a role to a user',
})
export class checkStickRoleCommand {
  constructor(
    @InjectModel(StickRole.name, 'api')
    private readonly stickRoleModel: Model<StickRole>,
  ) {}

  @Handler()
  async handler(
    @InteractionEvent(SlashCommandPipe) dto: checkStickRoleDto,
    @IA() interaction: CommandInteraction,
  ) {
    const { user: userToCheck } = dto;
    const checkExist = await this.stickRoleModel
      .findOne({
        userId: userToCheck.id,
      })
      .exec();
    if (checkExist) {
      const userStickRole = await interaction.guild.roles.fetch(
        checkExist.roleId,
      );
      await interaction.reply({
        content: `This user has stick role ${userStickRole.name}`,
        ephemeral: true,
      });
      return;
    }
  }
}
