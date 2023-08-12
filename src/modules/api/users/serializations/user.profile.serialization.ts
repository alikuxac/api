import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserGetSerialization } from './user.get.serialization';

export class UserProfileSerialization extends OmitType(UserGetSerialization, [
  'isActive',
  'isBanned',
  'isDisabled',
  'disabledAt',
] as const) {
  @ApiHideProperty()
  @Exclude()
  readonly isActive: boolean;

  @ApiHideProperty()
  @Exclude()
  readonly inactivePermanent: boolean;

  @ApiHideProperty()
  @Exclude()
  readonly blocked: boolean;

  @ApiHideProperty()
  @Exclude()
  readonly inactiveDate?: Date;

  @ApiHideProperty()
  @Exclude()
  readonly blockedDate?: Date;
}
