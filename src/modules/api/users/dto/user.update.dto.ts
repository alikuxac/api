import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsOptional, IsString, IsEmail, IsEnum, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { UserSex } from '../constants/user.constant';

export class UserUpdateDto {
  @ApiProperty({
    description: 'User Email',
    example: faker.internet.email(),
    required: false,
    type: String,
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  @Type(() => String)
  readonly email?: string;

  @ApiProperty({
    description: 'First Name of User',
    example: faker.person.firstName(),
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly firstName?: string;

  @ApiProperty({
    description: 'Last Name of User',
    example: faker.person.lastName(),
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly lastName?: string;

  @ApiProperty({
    description: 'Display Name of User',
    example: faker.internet.displayName(),
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly displayName?: string;

  @ApiProperty({
    description: 'User sex',
    enum: UserSex,
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  @IsEnum(UserSex)
  @Type(() => String)
  readonly sex?: UserSex;
}

export class UserUpdateAvatarDto {
  @ApiProperty({
    description: 'User avatar',
    example: faker.internet.avatar(),
    required: false,
    type: String,
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  @Type(() => String)
  readonly avatar?: string;
}
