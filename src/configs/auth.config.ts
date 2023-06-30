import { registerAs } from '@nestjs/config';
import { seconds } from 'src/common/helper/constants/helper.function.constant';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    subject: process.env.AUTH_JWT_SUBJECT ?? 'aliDevelopment',
    audience: process.env.AUTH_JWT_AUDIENCE ?? 'https://api.alikuxac.xyz',
    issuer: process.env.AUTH_JWT_ISSUER ?? 'alikuxac',
    prefixAuthorization: 'Bearer',
    accessToken: {
      secretKey: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY,
      expried: seconds(process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED) ?? '15m',
      notBeforeExpiration: seconds('0'),
    },
    refreshToken: {
      secretKey: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY,
      expried: seconds(process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED) ?? '15m',
      notBeforeExpiration:
        seconds(process.env.AUTH_JWT_REFRESH_TOKEN_NOT_BEFORE_EXPIRATION) ??
        '15m',
    },
    password: {
      attempt: true,
      maxAttempt: 3,
      saltLength: 8,
      expiredIn: '182d', // recommendation for production is 182 days
    },
    cache_ttl: process.env.CACHE_TTL,
    jwt_secret: process.env.JWT_SECRET,
    jwt_expires: process.env.JWT_EXPIRES_IN,
  }),
);
