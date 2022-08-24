import {
  IsString,
  IsEmail,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserSex } from '@users/enum/sex.enum';

export class createUserDto {
  @ApiProperty({ name: 'email', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ name: 'username', description: 'User username' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ name: 'password', description: 'User password' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ name: 'first_name', description: 'User first name' })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({ name: 'last_name', description: 'User last name' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    name: 'display_name',
    description: 'User display name',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  banned?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @ApiPropertyOptional({
    default: UserSex.UNKNOWN,
    enum: UserSex,
  })
  @IsEnum(UserSex)
  @IsOptional()
  sex?: UserSex;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => providerDto)
  providers?: providerDto[];
}

export class updateUserDto extends createUserDto {
  @IsString()
  @IsOptional()
  id: string;
}

export class providerDto {
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class changePasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class setRoleDto {
  @IsString()
  @IsNotEmpty()
  roleName: string;
}

export class updatePasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
