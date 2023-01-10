import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RolePermission } from './role.enum';
import { PartialType, OmitType } from '@nestjs/swagger';

export class createRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RolePermission)
  @IsOptional()
  permissions?: RolePermission[];
}

export class updateRoleDto extends PartialType(
  OmitType(createRoleDto, ['permissions'] as const),
) {}

export class updatePositionDto {
  @IsString()
  @IsNotEmpty()
  position: number;
}
