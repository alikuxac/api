import {
  SubCommand,
  DiscordTransformedCommand,
  UsePipes,
  Payload,
  TransformedCommandExecutionContext,
} from '@discord-nestjs/core';
import { TransformPipe } from '@discord-nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { StickRole } from '@discord/entities';
import { RemoveStickRoleDto } from '@discord/dto/bot/stickRole.dto';

@UsePipes(TransformPipe)
@SubCommand({
  name: 'addsStickRole',
  description: 'Stick a role to a user',
})
export class RemoveStickRoleCommand
  implements DiscordTransformedCommand<RemoveStickRoleDto>
{
  constructor(
    @InjectModel(StickRole.name, 'api')
    private readonly stickRoleModel: Model<StickRole>,
  ) {}

  async handler(
    @Payload() dto: RemoveStickRoleDto,
    { interaction }: TransformedCommandExecutionContext,
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
      const role = guild.roles.fetch(checkExist.roleId);
      r;
      await this.stickRoleModel.deleteOne({ user: userToAdd.id });
      await interaction.reply({
        content: `Stick role has been removed from ${userToAdd.username}`,
        ephemeral: true,
      });
    }
  }
}
