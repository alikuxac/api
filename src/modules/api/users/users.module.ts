import { Module, DynamicModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './services/users.service';
import { UserAbilityFactory } from './factory/user-ability.factory';

// Entity
import { User, UserSchema } from 'src/modules/api/users/entities/user.entity';
import { Role, RoleSchema } from 'src/modules/api/roles/entity/roles.entity';

// Interceptor
import { CurrentUserInterceptor } from 'src/modules/api/users/interceptors/current-user.interceptors';

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
  providers: [
    UsersService,
    UserAbilityFactory,
    { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
  ],
  exports: [UsersService, UserAbilityFactory],
})
export class UsersModule {
  static forFeature(): DynamicModule {
    return {
      module: UsersModule,
      providers: [UsersService, UserAbilityFactory, CurrentUserInterceptor],
      exports: [UsersService, UserAbilityFactory, CurrentUserInterceptor],
    };
  }
}
