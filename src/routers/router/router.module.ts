import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

// Module
import { HealthModule } from '@root/health/health.module';
import { FunModule } from 'src/modules/public/fun/fun.module';
import { UsersModule } from '@root/modules/api/users/users.module';
import { AuthModule } from '@root/common/auth/auth.module';

// Controller
import { HealthController } from '@root/health/health.controller';
import { FunController } from '@root/modules/public/fun/controller/fun.controller';
import { UserAuthController } from '@root/modules/api/users/controllers/user.auth.controller';

@Module({
  controllers: [HealthController, FunController, UserAuthController],
  imports: [
    HealthModule,
    FunModule,
    UsersModule.forFeature(),
    AuthModule,
    TerminusModule,
  ],
})
export class RouterModule {}
