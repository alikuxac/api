import { Module } from '@nestjs/common';

import { SharedModule } from '@shared/shared.module';
import { UsersModule } from '@users';

import { UserController } from './user.controller';

@Module({
  imports: [SharedModule, UsersModule],
  controllers: [UserController],
})
export class UserModule {}
