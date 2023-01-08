import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { json, urlencoded } from 'express';
import compression from 'compression';

import { AppModule } from './app.module';

import { RedisService } from '@shared/redis/redis.service';
// import { B2Service } from '@shared/b2/b2.service';
// import { R2Service } from '@shared/r2/r2.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'log', 'warn', 'verbose'],
  });

  const configService = app.get(ConfigService);

  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(compression());

  // Initialize Service
  const redis = app.get<RedisService>(RedisService);
  await redis.connect();

  // const b2 = app.get<B2Service>(B2Service);
  // b2.connect();

  // const r2 = app.get<R2Service>(R2Service);
  // r2.connect();

  await app.listen(configService.get<number>('PORT'));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
