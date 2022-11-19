import { Param, ParamType } from '@discord-nestjs/core';
import { Role, User } from 'discord.js';

export class AddStickRoleDto {
  @Param({
    type: ParamType.ROLE,
    description: 'Role',
    required: true,
  })
  role: Role;

  @Param({
    name: 'user',
    type: ParamType.USER,
    description: 'User',
    required: true,
  })
  user: User;
}

export class RemoveStickRoleDto {
  @Param({
    name: 'user',
    type: ParamType.USER,
    description: 'User',
    required: true,
  })
  user: User;
}

export class checkStickRoleDto {
  @Param({
    name: 'user',
    type: ParamType.USER,
    description: 'User',
    required: true,
  })
  user: User;
}
