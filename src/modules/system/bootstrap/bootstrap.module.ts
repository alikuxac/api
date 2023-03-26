import { Module } from '@nestjs/common';

import { RolesModule } from '@root/modules/api/roles/roles.module';
import { UsersModule } from '@root/modules/api/users/users.module';

/**
 * Init module
 */
@Module({
  imports: [RolesModule, UsersModule],
})
export class BootstrapModule {}
