import { Module } from '@nestjs/common';

// Module
import { RolesModule } from '@root/modules/api/roles/roles.module';
import { RolesController } from '@root/modules/api/roles/controller/roles.controller';

import { UsersModule } from '@root/modules/api/users/users.module';
import { UsersController } from '@root/modules/api/users/controllers';

@Module({
  controllers: [RolesController, UsersController],
  imports: [RolesModule, UsersModule.forFeature()],
})
export class RouterAdminModule {}
