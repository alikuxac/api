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
import { AddStickRoleDto } from '@discord/dto/stickRole.dto';

@UsePipes(TransformPipe)
@SubCommand({
  name: 'addsStickRole',
  description: 'Stick a role to a user',
})
export class AddStickRoleCommand
  implements DiscordTransformedCommand<AddStickRoleDto>
{
  constructor(
    @InjectModel(StickRole.name, 'api')
    private readonly stickRoleModel: Model<StickRole>,
  ) {}

  async handler(
    @Payload() dto: AddStickRoleDto,
    { interaction }: TransformedCommandExecutionContext,
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
