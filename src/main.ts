import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { json, urlencoded } from 'express';
import compression from 'compression';

import { AppModule } from './modules/app/app.module';

import { RedisService } from './modules/shared/redis/redis.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(compression());

  // Initialize Service

  const redis = await app.get<RedisService>(RedisService);
  await redis.connect();

  await app.listen(configService.get<number>('PORT'));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
