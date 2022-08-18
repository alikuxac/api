import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';

// Entity
import { User, UserSchema } from './user.entity';

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
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}