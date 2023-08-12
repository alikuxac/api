import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

// Module
import { HealthModule } from '@root/modules/system/health/health.module';
import { FunModule } from 'src/modules/public/fun/fun.module';
import { UsersModule } from '@root/modules/api/users/users.module';
import { AuthModule } from '@root/common/auth/auth.module';

// Controller
import { HealthController } from '@root/modules/system/health/controllers/health.controller';
import { FunController } from '@root/modules/public/fun/controller/fun.controller';
import { UserAuthController } from '@root/modules/api/users/controllers/user.auth.controller';
import { MessagePublicController } from '@root/common/message/controllers/message.public.controller';

@Module({
  controllers: [
    HealthController,
    FunController,
    UserAuthController,
    MessagePublicController,
  ],
  imports: [HealthModule, FunModule, UsersModule, AuthModule, TerminusModule],
})
export class RouterModule {}
