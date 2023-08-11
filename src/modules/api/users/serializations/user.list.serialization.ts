import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { RoleListSerialization } from 'src/common/roles/serializations/role.list.serialization';
import { UserProfileSerialization } from 'src/modules/api/users/serializations/user.profile.serialization';

export class UserListSerialization extends OmitType(UserProfileSerialization, [
  'signUpDate',
  'role',
] as const) {
  @ApiProperty({
    type: () => RoleListSerialization,
    required: true,
    nullable: false,
  })
  @Type(() => RoleListSerialization)
  readonly role: RoleListSerialization;

  @ApiHideProperty()
  @Exclude()
  readonly signUpDate: Date;
}
