import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './services/users.service';

// Entity
import { User, UserSchema } from 'src/modules/api/users/entities/user.entity';

@Module({
  imports: [
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
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {
  static forFeature(): DynamicModule {
    return {
      module: UsersModule,
      providers: [UsersService],
      exports: [UsersService],
    };
  }
}
