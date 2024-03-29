import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AuthJwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwtAccess',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme(
        configService.get<string>('auth.prefixAuthorization'),
      ),
      ignoreExpiration: false,
      audience: configService.get<string>('auth.audience'),
      issuer: configService.get<string>('auth.issuer'),
      jsonWebTokenOptions: {
        ignoreNotBefore: false,
        subject: configService.get<string>('auth.subject'),
      },
      secretOrKey: configService.get<string>('auth.jwt_secret'),
    });
  }

  async validate({ data }: Record<string, any>): Promise<Record<string, any>> {
    return data;
  }
}
