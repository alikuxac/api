import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RoleAbilityFactory } from './role-ability.factory';
import { Role, RoleSchema } from './roles.entity';
import { User, UserSchema } from '@users';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Role.name, schema: RoleSchema },
        { name: User.name, schema: UserSchema },
      ],
      'api',
    ),
  ],
  controllers: [RolesController],
  providers: [RolesService, RoleAbilityFactory],
  exports: [RolesService, RoleAbilityFactory],
})
export class RolesModule {}
