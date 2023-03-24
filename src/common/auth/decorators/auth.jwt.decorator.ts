import {
  ExecutionContext,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { JwtAuthAccessGuard } from '../guards/jwt-access/jwt-access.guard';
import { JwtAuthRefreshGuard } from '../guards/jwt-refresh/jwt-refresh.guard';

export const AuthJwtPayload = createParamDecorator(
  (data: string, ctx: ExecutionContext): Record<string, any> => {
    const { user } = ctx.switchToHttp().getRequest();
    console.log(user);
    return data ? user[data] : user;
  },
);

export const AuthJwtToken = createParamDecorator(
  (_data: string, ctx: ExecutionContext): string => {
    const { headers } = ctx.switchToHttp().getRequest();
    const { authorization } = headers;
    const authorizations: string[] = authorization.split(' ');
    console.log(authorizations);
    return authorizations.length >= 2 ? authorizations[1] : undefined;
  },
);

export function AuthJwtAccessProtected(): MethodDecorator {
  return applyDecorators(UseGuards(JwtAuthAccessGuard));
}

export function AuthJwtRefreshProtected(): MethodDecorator {
  return applyDecorators(UseGuards(JwtAuthRefreshGuard));
}
