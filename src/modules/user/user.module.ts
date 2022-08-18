import { Module, OnModuleInit } from '@nestjs/common';

import { SharedModule } from '@shared/shared.module';
import { UsersModule, UsersService } from '@users';

import { UserController } from './user.controller';

@Module({
  imports: [SharedModule, UsersModule],
  controllers: [UserController],
})
export class UserModule implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    await this.usersService.init();
  }
}
