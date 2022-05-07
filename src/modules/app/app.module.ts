import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { ScheduleModule } from '@nestjs/schedule';

import Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HealthModule } from '../health/health.module';
import { SharedModule } from '#modules/shared/shared.module';
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

      }),
    EventEmitterModule.forRoot({
      wildcard: true,
      maxListeners: 20,
      verboseMemoryLeak: true,
    }),
    ScheduleModule.forRoot(),
    HealthModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
