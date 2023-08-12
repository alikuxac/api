import { Module } from '@nestjs/common';

import { UsersService } from './services/users.service';

import { UserRepositoryModule } from './repositories/user.repository.module';

@Module({
  imports: [UserRepositoryModule],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
