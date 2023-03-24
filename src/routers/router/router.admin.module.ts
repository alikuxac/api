import { Module } from '@nestjs/common';

// Module
import { RolesModule, RolesController } from 'src/modules/api/roles';
import { UsersModule, UsersController } from '@root/modules/api/users';

@Module({
  controllers: [RolesController, UsersController],
  imports: [RolesModule, UsersModule],
})
export class RouterAdminModule {}
