import { IA, InteractionEvent, SubCommand } from '@discord-nestjs/core';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { StickRole } from 'src/modules/bot/discord/entities';
import { RemoveStickRoleDto } from 'src/modules/bot/discord/dto/stickRole.dto';
import { CommandInteraction } from 'discord.js';

@SubCommand({
  name: 'addsStickRole',
  description: 'Stick a role to a user',
})
export class RemoveStickRoleCommand {
  constructor(
    @InjectModel(StickRole.name, 'api')
    private readonly stickRoleModel: Model<StickRole>,
  ) {}

  async handler(
    @InteractionEvent(SlashCommandPipe) dto: RemoveStickRoleDto,
    @IA() interaction: CommandInteraction,
  ) {
    const { user: userToAdd } = dto;
    const { guild } = interaction;

    const checkExist = await this.stickRoleModel
      .findOne({
        guildId: guild.id,
        user: userToAdd.id,
      })
      .exec();
    if (!checkExist) {
      await interaction.reply({
        content: `This user doesn't have stick role`,
        ephemeral: true,
      });
      return;
    } else {
      const role = await guild.roles.fetch(checkExist.roleId);
      const member = guild.members.cache.get(userToAdd.id);
      Promise.all([
        await this.stickRoleModel.deleteOne({
          guildId: guild.id,
          user: userToAdd.id,
        }),
        await member.roles.remove(role),
      ]);
      await interaction.reply({
        content: `Stick role has been removed from ${userToAdd.username}`,
        ephemeral: true,
      });
      return;
    }
  }
}
