import { Module } from '@nestjs/common';

import { RolesModule } from '@root/common/roles/roles.module';
import { UsersModule } from '@root/modules/api/users/users.module';

/**
 * Init module
 */
@Module({
  imports: [RolesModule, UsersModule],
})
export class BootstrapModule {}
