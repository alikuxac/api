import { Module } from '@nestjs/common';

import { SharedModule } from '@shared';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

// Strategy
import {
  ApiKeyStrategy,
  DiscordStrategy,
  FacebookStrategy,
  GithubStrategy,
  GoogleStrategy,
  JwtStrategy,
  LocalStrategy,
} from './strategies';

@Module({
  imports: [SharedModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    ApiKeyStrategy,
    DiscordStrategy,
    FacebookStrategy,
    GithubStrategy,
    GoogleStrategy,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
