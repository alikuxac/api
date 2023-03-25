import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

import { SKIP_AUTH_KEY } from '../../decorators/auth.skip.decorator';

@Injectable()
export class JwtAuthAccessGuard extends AuthGuard('jwtAccess') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: Error, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
