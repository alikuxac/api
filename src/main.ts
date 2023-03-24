import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { json, urlencoded } from 'express';
import compression from 'compression';

import { AppModule } from './app/app.module';

import { RedisService } from 'src/shared/services/redis.service';

import { HttpExceptionFilter } from './shared/filter/http-exception.filter';
import { LoggingInterceptor, TimeoutInterceptor } from './shared/interceptors';

import setupSwagger from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'log', 'warn', 'verbose'],
    bodyParser: false,
  });
  const logger = new Logger();

  const configService = app.get(ConfigService);

  const port = configService.get<number>('app.port');

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TimeoutInterceptor());

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(compression());

  // Initialize Service
  const redis = app.get<RedisService>(RedisService);
  await redis.connect();

  await setupSwagger(app);

  await app.listen(port, () => {
    logger.log(`Server is running at port ${port}`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
