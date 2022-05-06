import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { ScheduleModule } from '@nestjs/schedule';

import Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HealthModule } from '../health/health.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        // APP
        NODE_ENV: Joi.string().default('development'),
        PORT: Joi.number().default(3000),
      }),
    }),
    // ScheduleModule.forRoot(),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
