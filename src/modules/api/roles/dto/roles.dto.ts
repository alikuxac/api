import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RolePermission } from '../constants/role.constant';
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

export class queryGetAllDto {
  @IsNumber()
  @IsOptional()
  page?: number;
}
