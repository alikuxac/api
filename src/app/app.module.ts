import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailerModule } from '@nestjs-modules/mailer';
import {
  I18nModule,
  QueryResolver,
  CookieResolver,
  HeaderResolver,
} from 'nestjs-i18n';

import Joi from 'joi';
import configs from '../configs';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SharedModule } from '@shared/shared.module';
import { UsersModule } from '@users';
import { AuthModule } from '@auth';

import { modules } from '@modules';
import path from 'path';
import { SystemsModule } from '@systems';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        // APP
        NODE_ENV: Joi.string().default('development').required(),
        PORT: Joi.number().default(3000),
        CACHE_TTL: Joi.number().default(120),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.number().default(86400),

        // Database
        MONGO_URI: Joi.string().required(),

        // Redis
        REDIS_URL: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),

        // S3
        B2_ENABLED: Joi.boolean().default(false).required(),
        B2_ENDPOINT: Joi.when('B2_ENABLED', {
          is: true,
          then: Joi.string().required(),
        }),
        B2_ACCESS_KEY_ID: Joi.when('B2_ENABLED', {
          is: true,
          then: Joi.string().required(),
        }),
        B2_SECRET_ACCESS_KEY: Joi.when('B2_ENABLED', {
          is: true,
          then: Joi.string().required(),
        }),
        R2_ENABLED: Joi.boolean().default(false).required(),
        R2_ENDPOINT: Joi.when('R2_ENABLED', {
          is: true,
          then: Joi.string().required(),
        }),
        R2_ACCESS_KEY_ID: Joi.when('R2_ENABLED', {
          is: true,
          then: Joi.string().required(),
        }),
        R2_SECRET_ACCESS_KEY: Joi.when('R2_ENABLED', {
          is: true,
          then: Joi.string().required(),
        }),

        // Mailer
        MAILER_HOST: Joi.string().required(),
        MAILER_PORT: Joi.number().required(),
        MAILER_USER: Joi.string().required(),
        MAILER_PASS: Joi.string().required(),
        MAILER_SECURE: Joi.boolean().required(),

        // Discord
        DISCORD_TOKEN: Joi.string().required(),
        DISCORD_CLIENT_ID: Joi.string().required(),
        DISCORD_CLIENT_SECRET: Joi.string().required(),

        // Github
        GITHUB_CLIENT_ID: Joi.string().required(),
        GITHUB_CLIENT_SECRET: Joi.string().required(),
        GITHUB_REDIRECT_URI: Joi.string().required(),

        // Google
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),

        // Facebook
        FACEBOOK_APP_ID: Joi.string().required(),
        FACEBOOK_APP_SECRET: Joi.string().required(),

        // API
        HYPIXEL_KEY: Joi.string().required(),

        // Admin
        ADMIN_EMAIL: Joi.string().required(),
        ADMIN_PASSWORD: Joi.string().required(),
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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        defaults: {
          from: configService.get<string>('MAILER_FROM'),
        },
        transport: {
          host: configService.get<string>('MAILER_HOST'),
          port: configService.get<number>('MAILER_PORT'),
          secure: configService.get<boolean>('MAILER_SECURE'),
          auth: {
            user: configService.get<string>('MAILER_USER'),
            pass: configService.get<string>('MAILER_PASS'),
          },
        },
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'language', 'l']),
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(['lang', 'l']),
      ],
    }),
    SharedModule,
    SystemsModule,
    UsersModule,
    AuthModule,
    ...modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}