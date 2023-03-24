import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthAccessGuard extends AuthGuard('jwtAccess') {
  handleRequest<TUser = any>(err: Error, user: TUser, info: Error): TUser {
    console.log('err:', info);
    console.log('user:', user);
    if (err || !user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
