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
import { checkStickRoleDto } from '@discord/dto/stickRole.dto';

@UsePipes(TransformPipe)
@SubCommand({
  name: 'addsStickRole',
  description: 'Stick a role to a user',
})
export class checkStickRoleCommand
  implements DiscordTransformedCommand<checkStickRoleDto>
{
  constructor(
    @InjectModel(StickRole.name, 'api')
    private readonly stickRoleModel: Model<StickRole>,
  ) {}

  async handler(
    @Payload() dto: checkStickRoleDto,
    { interaction }: TransformedCommandExecutionContext,
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
