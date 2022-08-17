import {
  IsString,
  IsEmail,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
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

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  banned?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @ApiProperty({
    default: UserSex.UNKNOWN,
    enum: UserSex,
  })
  @IsEnum(UserSex)
  @IsOptional()
  sex?: UserSex;
}

export class updateUserDto extends createUserDto {
  @IsString()
  @IsOptional()
  id: string;
}
