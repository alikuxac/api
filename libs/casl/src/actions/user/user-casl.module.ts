import { Module } from '@nestjs/common';

import { UserAbilityFactory, UserRoleAbilityFactory } from './index';

@Module({
  providers: [UserAbilityFactory, UserRoleAbilityFactory],
  exports: [UserAbilityFactory, UserRoleAbilityFactory],
})
export class UserCaslModule {}
