import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-discord';

import { AuthService } from '../auth.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('DISCORD_CLIENT_ID'),
      clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET'),
      callbackURL: configService.get<string>('DISCORD_CALLBACK_URL'),
      scope: ['identify', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const {
      id,
      username,
      email,
      discriminator,
      flags,
      mfa_enabled,
      verified,
      avatar,
    } = profile;
    const data = {
      id,
      username,
      email,
      discriminator,
      flags,
      mfa_enabled,
      verified,
      avatar: this.generateDiscordUserAvatarUrl(id, avatar),
    };
    return data;
  }

  private generateDiscordUserAvatarUrl(userId: string, userAvatarHash: string) {
    // https://discord.com/developers/docs/reference#image-formatting
    return `https://cdn.discordapp.com/avatars/${userId}/${userAvatarHash}.png`;
  }
}
