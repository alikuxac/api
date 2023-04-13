import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  RolePermission,
  RolePermissionGroup,
} from 'src/common/policy/constants/policy.enum.constant';
import { PartialType, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class rolePermissionDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(RolePermissionGroup)
  subject: RolePermissionGroup;

  @IsString({ each: true })
  @IsEnum(RolePermission, { each: true })
  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  action: RolePermission[];
}

export class createRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => rolePermissionDto)
  @IsNotEmpty()
  @IsArray()
  readonly permissions: rolePermissionDto[];
}

export class updateRoleDto extends PartialType(
  OmitType(createRoleDto, ['permissions'] as const),
) {}

export class updatePositionDto {
  @IsString()
  @IsNotEmpty()
  position: number;
}

export class queryGetAllDto {
  @IsNumber()
  @IsOptional()
  page?: number;
}

export class updateRolePermissionDto extends OmitType(createRoleDto, [
  'name',
  'description',
] as const) {}
