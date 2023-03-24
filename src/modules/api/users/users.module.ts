import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './services/users.service';
import { UserAbilityFactory } from './factory/user-ability.factory';

// Entity
import { User, UserSchema } from 'src/modules/api/users/entities/user.entity';
import { Role, RoleSchema } from 'src/modules/api/roles/entity/roles.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: User.name,
          schema: UserSchema,
        },
        {
          name: Role.name,
          schema: RoleSchema,
        },
      ],
      'api',
    ),
  ],
  controllers: [],
  providers: [UsersService, UserAbilityFactory],
  exports: [UsersService, UserAbilityFactory],
})
export class UsersModule {}
