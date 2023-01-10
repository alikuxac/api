import { Inject, Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from '@shared';
import { UsersService } from '@users/services';
import { userControllers } from '@users/controllers';
import { userFactoryArray } from '@users/factory';

// Entity
import { User, UserSchema } from '@users/entities';

import { RolesModule, RolesService } from '@systems';

@Module({
  imports: [
    SharedModule,
    forwardRef(() => RolesModule),
    MongooseModule.forFeature(
      [
        {
          name: User.name,
          schema: UserSchema,
        },
      ],
      'api',
    ),
  ],
  controllers: [...userControllers],
  providers: [UsersService, ...userFactoryArray],
  exports: [UsersService, ...userFactoryArray],
})
export class UsersModule implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
  ) {}

  async onModuleInit() {
    this.rolesService.init().then(async (role) => {
      await this.usersService.init(role._id);
    });
  }
}
