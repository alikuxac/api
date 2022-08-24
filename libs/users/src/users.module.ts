import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from '@shared';
import { UserCaslModule } from '@casl';
import { UsersService, UserRoleService } from '@users/services';
import { UsersController } from '@users/controllers';

// Entity
import { User, UserSchema, UserRole, UserRoleSchema } from '@users/entities';

@Module({
  imports: [
    SharedModule,
    UserCaslModule,
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
      ],
      'api',
    ),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRoleService],
  exports: [UsersService, UserRoleService],
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
