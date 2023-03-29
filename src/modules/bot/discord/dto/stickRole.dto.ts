import { IsNumberString, IsOptional } from 'class-validator';
import { Param, ParamType } from '@discord-nestjs/core';
import { Role, User } from 'discord.js';

// Bot
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

// Api
export class getAllStickRoleDto {
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  page?: number;
}
