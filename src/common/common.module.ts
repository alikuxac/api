import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import {
  I18nModule,
  QueryResolver,
  HeaderResolver,
  CookieResolver,
} from 'nestjs-i18n';
import { MongooseModule } from '@nestjs/mongoose';

import path from 'path';
import Joi from 'joi';

import configs from 'src/configs';

// Custom Module
import { HelperModule } from 'src/common/helper/helper.module';
import { AuthModule } from 'src/common/auth/auth.module';

@Global()
@Module({
  controllers: [],
  providers: [],
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

        // Auth
        AUTH_JWT_SUBJECT: Joi.string().required(),
        AUTH_JWT_AUDIENCE: Joi.string().required(),
        AUTH_JWT_ISSUER: Joi.string().required(),

        AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string()
          .alphanum()
          .min(5)
          .max(50)
          .required(),
        AUTH_JWT_ACCESS_TOKEN_EXPIRED: Joi.string().default('15m').required(),

        AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string()
          .alphanum()
          .min(5)
          .max(50)
          .required(),
        AUTH_JWT_REFRESH_TOKEN_EXPIRED: Joi.string().default('7d').required(),
        AUTH_JWT_REFRESH_TOKEN_REMEMBER_ME_EXPIRED: Joi.string()
          .default('30d')
          .required(),
        AUTH_JWT_REFRESH_TOKEN_NOT_BEFORE_EXPIRATION: Joi.string()
          .default('15m')
          .required(),

        AUTH_JWT_PAYLOAD_ENCRYPT: Joi.boolean().default(false).required(),
        AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY: Joi.string()
          .allow(null, '')
          .min(20)
          .max(50)
          .optional(),
        AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV: Joi.string()
          .allow(null, '')
          .min(16)
          .max(50)
          .optional(),
        AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_KEY: Joi.string()
          .allow(null, '')
          .min(20)
          .max(50)
          .optional(),
        AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_IV: Joi.string()
          .allow(null, '')
          .min(16)
          .max(50)
          .optional(),

        // API
        HYPIXEL_KEY: Joi.string().required(),

        // Admin
        ADMIN_EMAIL: Joi.string().required(),
        ADMIN_PASSWORD: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
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
          from: configService.get<string>('mail.from'),
        },
        transport: {
          host: configService.get<string>('mail.host'),
          port: configService.get<number>('mail.port'),
          secure: configService.get<boolean>('mail.secure'),
          auth: {
            user: configService.get<string>('mail.user'),
            pass: configService.get<string>('mail.pass'),
          },
        },
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '..', '/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'language', 'l']),
        new HeaderResolver(['x-custom-lang', 'api-lang']),
        new CookieResolver(['lang', 'l']),
      ],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      connectionName: 'api',
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGO_URI'),
        dbName: 'api',
      }),
    }),
    HttpModule,
    HelperModule,
    AuthModule,
  ],
})
export class CommonModule {}