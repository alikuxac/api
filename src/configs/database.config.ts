import { registerAs } from '@nestjs/config';

export default registerAs(
  'database',
  (): Record<string, any> => ({
    mongo_url: process.env.MONGO_URI,
    redis_host: process.env.REDIS_HOST ?? '127.0.0.1',
    redis_port: parseInt(process.env.REDIS_PORT) ?? 6379,
  }),
);
