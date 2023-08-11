import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  RolePermissionGroup,
  RolePermission,
} from 'src/common/policy/constants/policy.enum.constant';
import { IPolicyRule } from 'src/common/policy/interfaces/policy.interface';
import { UserProfileSerialization } from 'src/modules/api/users/serializations/user.profile.serialization';
export class UserPayloadPermissionSerialization {
  @ApiProperty({
    required: true,
    nullable: false,
    enum: RolePermissionGroup,
    example: RolePermissionGroup.USER,
  })
  subject: RolePermissionGroup;

  @ApiProperty({
    required: true,
    nullable: false,
  })
  action: string;
}

export class UserPayloadSerialization extends OmitType(
  UserProfileSerialization,
  ['role', 'signUpDate', 'createdAt', 'updatedAt'] as const,
) {
  @ApiProperty({
    example: [faker.string.uuid()],
    type: 'string',
    isArray: true,
    required: true,
    nullable: false,
  })
  @Transform(({ obj }) => `${obj.role._id}`)
  readonly role: string;

  @ApiProperty({
    type: () => UserPayloadPermissionSerialization,
    isArray: true,
    required: true,
    nullable: false,
  })
  @Transform(({ obj }) => {
    return obj.role.permissions.map(({ action, subject }: IPolicyRule) => {
      const ac = action.map((l) => RolePermission[l]);
      return {
        subject,
        action: ac.join(','),
      };
    });
  })
  @Expose()
  readonly permissions: UserPayloadPermissionSerialization[];

  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.date.recent(),
  })
  @Expose()
  readonly lastActive: Date;

  @ApiHideProperty()
  @Exclude()
  readonly createdAt: number;

  @ApiHideProperty()
  @Exclude()
  readonly updatedAt: number;
}
