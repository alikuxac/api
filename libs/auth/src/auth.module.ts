import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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

import { UsersModule } from '@users';

@Module({
  imports: [SharedModule, UsersModule],
  controllers: [AuthController],
  providers: [
    JwtService,
    AuthService,
    ApiKeyStrategy,
    DiscordStrategy,
    FacebookStrategy,
    GithubStrategy,
    GoogleStrategy,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [
    AuthService,
    ApiKeyStrategy,
    DiscordStrategy,
    FacebookStrategy,
    GithubStrategy,
    GoogleStrategy,
    JwtStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}
