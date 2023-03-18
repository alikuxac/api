import { registerAs } from '@nestjs/config';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    cache_ttl: process.env.CACHE_TTL,
    jwt_secret: process.env.JWT_SECRET,
    jwt_expires: process.env.JWT_EXPIRES_IN,
  }),
);
