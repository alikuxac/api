import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

import { UsersService } from 'src/modules/api/users/services/users.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'apikey',
) {
  constructor(private readonly usersService: UsersService) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey) => {
      return this.validate(apiKey);
    });
  }

  async validate(apiKey: string) {
    const user = await this.usersService.findByApiKey(apiKey);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
