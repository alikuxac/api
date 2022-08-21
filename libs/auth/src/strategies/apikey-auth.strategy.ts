import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

import { UsersService, UserApiKeyService } from '@users/services';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'apikey',
) {
  constructor(
    private readonly userApiKeyService: UserApiKeyService,
    private readonly usersService: UsersService,
  ) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey) => {
      return this.validate(apiKey);
    });
  }

  async validate(apiKey: string) {
    const userApiKey = await this.userApiKeyService.findByValue(apiKey);
    if (!userApiKey) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findOne(userApiKey.owner.toString());
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
