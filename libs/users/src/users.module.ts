import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from '@shared';

import {
  UsersService,
  UserRoleService,
  UserApiKeyService,
} from '@users/services';
import { UsersController } from '@users/controllers';

// Entity
import {
  User,
  UserSchema,
  UserRole,
  UserRoleSchema,
  UserApiKey,
  UserApiKeySchema,
} from '@users/entities';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature(
      [
        {
          name: User.name,
          schema: UserSchema,
        },
        {
          name: UserRole.name,
          schema: UserRoleSchema,
        },
        {
          name: UserApiKey.name,
          schema: UserApiKeySchema,
        },
      ],
      'api',
    ),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRoleService, UserApiKeyService],
  exports: [UsersService, UserRoleService, UserApiKeyService],
})
export class UsersModule implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRoleSerive: UserRoleService,
  ) {}

  async onModuleInit() {
    this.usersRoleSerive.init().then(async () => {
      await this.usersService.init();
    });
  }
}
