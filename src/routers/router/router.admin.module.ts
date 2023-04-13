import { Module } from '@nestjs/common';

// Module
import { RolesModule } from '@root/common/roles/roles.module';
import { RolesController } from '@root/common/roles/controller/roles.controller';

import { UsersModule } from '@root/modules/api/users/users.module';
import { UsersController } from '@root/modules/api/users/controllers/users.controller';

@Module({
  controllers: [RolesController, UsersController],
  imports: [RolesModule, UsersModule.forFeature()],
})
export class RouterAdminModule {}
