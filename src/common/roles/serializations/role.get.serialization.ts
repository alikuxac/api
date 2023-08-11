import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  RolePermission,
  RolePermissionGroup,
} from 'src/common/policy/constants/policy.enum.constant';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

export class RoleGetPermissionSerialization {
  @ApiProperty({
    required: true,
    nullable: false,
    description: 'Permission subject',
    enum: RolePermissionGroup,
  })
  subject: RolePermissionGroup;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'Permission action base on subject',
    isArray: true,
    enum: RolePermission,
    default: Object.values(RolePermission),
  })
  action: RolePermission[];
}

export class RoleGetSerialization extends ResponseIdSerialization {
  @ApiProperty({
    description: 'Name of the role',
    example: 'Admin',
    required: true,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'Description of the role',
    required: false,
    default: '',
  })
  description?: string;

  @ApiProperty({
    type: () => RoleGetPermissionSerialization,
    required: true,
    nullable: false,
    default: [],
  })
  @Type(() => RoleGetPermissionSerialization)
  readonly permissions: RoleGetPermissionSerialization;

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
