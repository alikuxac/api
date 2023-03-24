import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RolesService } from './service/roles.service';
import { RoleAbilityFactory } from './factory/role-ability.factory';
import { Role, RoleSchema } from './entity/roles.entity';
// import { UsersModule } from 'src/modules/api/users';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }], 'api'),
  ],
  controllers: [],
  providers: [RolesService, RoleAbilityFactory],
  exports: [RolesService, RoleAbilityFactory],
})
export class RolesModule {}
