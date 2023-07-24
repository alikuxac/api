import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';

import { json, urlencoded } from 'express';
import compression from 'compression';

import { AppModule } from './app/app.module';

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

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(compression());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await setupSwagger(app);

  await app.listen(port, () => {
    logger.log(`Server is running at port ${port}`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
