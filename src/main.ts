import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { json, urlencoded } from 'express';
import compression from 'compression';

import { AppModule } from './app/app.module';

import { RedisService } from '@shared/redis/redis.service';

import { HttpExceptionFilter } from './shared/filter/http-exception.filter';
import { LoggingInterceptor, TimeoutInterceptor } from './shared/interceptors';

import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'log', 'warn', 'verbose'],
  });

  const configService = app.get(ConfigService);

  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TimeoutInterceptor());

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(compression());

  // Initialize Service
  const redis = app.get<RedisService>(RedisService);
  await redis.connect();

  setupSwagger(app);

  await app.listen(configService.get<number>('PORT'));
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
