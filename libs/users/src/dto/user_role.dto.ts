import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRolePermission } from '@users/enum';

export class createUserRoleDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateNested({ each: true })
  @Type(() => UserRolePermissionDto)
  permissions: UserRolePermissionDto[];
}

export class updateUserRoleDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UserRolePermissionDto {
  @IsEnum(UserRolePermission)
  action: UserRolePermission;

  @IsBoolean()
  allowed: boolean;
}

export class removeRolePermissionDto {
  @IsEnum(UserRolePermission)
  action: UserRolePermission;
}
