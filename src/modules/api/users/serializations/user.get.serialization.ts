import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { ResponseIdSerialization } from '@root/common/response/serializations/response.id.serialization';

import { RoleGetSerialization } from '@root/common/roles/serializations/role.get.serialization';

export class UserGetSerialization extends ResponseIdSerialization {
  @ApiProperty({
    required: true,
    nullable: false,
    type: () => RoleGetSerialization,
  })
  @Type(() => RoleGetSerialization)
  readonly role: RoleGetSerialization;

  @ApiProperty({
    description: 'username of the user',
    example: 'Admin',
    required: true,
    nullable: false,
  })
  readonly username: string;

  @ApiProperty({
    description: 'email of the user',
    example: faker.internet.email({ provider: 'gmail.com' }),
    required: true,
    nullable: false,
  })
  readonly email: string;

  @ApiHideProperty()
  @Exclude()
  readonly password: string;

  @ApiProperty({
    description: 'first name of the user',
    example: faker.person.firstName(),
    required: true,
    nullable: false,
  })
  readonly firstName: string;

  @ApiProperty({
    description: 'last name of the user',
    example: faker.person.lastName(),
    required: true,
    nullable: false,
  })
  readonly lastName: string;

  @ApiProperty({
    description: 'display name of the user',
    example: faker.person.fullName(),
    required: true,
    nullable: false,
  })
  readonly displayName: string;

  @ApiProperty({
    description: 'sex of the user',
    example: faker.person.sex(),
    required: true,
    nullable: false,
  })
  readonly sex: string;

  @ApiProperty({
    description: 'avatar of the user',
    example: faker.image.avatar(),
    required: false,
    default: '',
  })
  readonly avatar?: string;

  @ApiProperty({
    description: 'sign up date of the user',
    example: faker.date.recent(),
    required: true,
    nullable: false,
  })
  readonly signUpDate: Date;

  @ApiProperty({
    description: 'user is active or not',
    example: true,
  })
  readonly isActive: boolean;

  @ApiProperty({
    description: 'user is banned or not',
    example: false,
  })
  readonly isBanned: boolean;

  @ApiProperty({
    description: 'user is verified or not',
    example: false,
  })
  readonly isVerified: boolean;

  @ApiProperty({
    description: 'user is disabled or not',
    example: false,
  })
  readonly isDisabled: boolean;

  @ApiProperty({
    description: 'disabled date',
    example: faker.date.recent(),
    required: true,
  })
  readonly disabledAt: Date;

  @ApiProperty({
    description: 'Date created at',
    example: faker.date.recent(),
    required: true,
    nullable: false,
  })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Date updated at',
    example: faker.date.recent(),
    required: true,
    nullable: false,
  })
  readonly updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  readonly deletedAt?: Date;
}
