import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';

import { UserRolePermission } from '@users/enum';

export class createUserRoleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(UserRolePermission)
  permissions: UserRolePermission[];
}

export class updateUserRoleDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class updateUserRolePermissionDto {
  @IsEnum(UserRolePermission)
  action: UserRolePermission;

  @IsBoolean()
  allowed: boolean;

  @IsBoolean()
  restricted: boolean;
}

export class removeRolePermissionDto {
  @IsEnum(UserRolePermission)
  action: UserRolePermission;
}
