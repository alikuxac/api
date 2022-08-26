import { Module, forwardRef } from '@nestjs/common';

import { UserAbilityFactory, UserRoleAbilityFactory } from './actions';
import { UsersModule } from '@users';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [UserAbilityFactory, UserRoleAbilityFactory],
  exports: [UserAbilityFactory, UserRoleAbilityFactory],
})
export class CaslModule {}
