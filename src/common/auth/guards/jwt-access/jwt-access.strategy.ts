import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/common/auth/services/auth.service';

@Injectable()
export class AuthJwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwtAccess',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
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
      // algorithms: ['RS256'],
      secretOrKey: configService.get<string>('auth.jwt_secret'),
    });
  }

  async validate({ data }: Record<string, any>): Promise<Record<string, any>> {
    const payloadEncryption: boolean =
      await this.authService.getPayloadEncryption();

    return payloadEncryption ? this.authService.decryptAccessToken(data) : data;
  }
}
