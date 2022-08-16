import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';
import { EventEmitterModule } from '@nestjs/event-emitter';

import Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HealthModule } from '../health/health.module';
import { SharedModule } from '@shared/shared.module';
import { PublicModule } from '#modules/public/public.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        // APP
        NODE_ENV: Joi.string().default('development'),
        PORT: Joi.number().default(3000),
        CACHE_TTL: Joi.number().default(120),

        // Database
        MONGO_URI: Joi.string().required(),

        // Typeorm
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),

        // Redis
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),

        // S3
        B2_ENDPOINT: Joi.string().required(),
        B2_ACCESS_KEY_ID: Joi.string().required(),
        B2_SECRET_ACCESS_KEY: Joi.string().required(),
        R2_ENDPOINT: Joi.string().required(),
        R2_ACCESS_KEY_ID: Joi.string().required(),
        R2_SECRET_ACCESS_KEY: Joi.string().required(),
      }),
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      maxListeners: 20,
      verboseMemoryLeak: true,
    }),
    MulterModule.register({
      limits: {
        files: 5,
        fileSize: 10 * 1024 * 1024,
      },
    }),
    ScheduleModule.forRoot(),
    HealthModule,
    SharedModule,
    PublicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
