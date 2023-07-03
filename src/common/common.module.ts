import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { AwsModule } from 'src/common/aws/aws.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { DiscordModule } from '@discord-nestjs/core';
import { GatewayIntentBits } from 'discord.js';
import { PolicyModule } from './policy/policy.module';
import { ErrorModule } from './error/error.module';

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
        APP_LANGUAGE: Joi.string().default('en'),

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
        DISCORD_PREFIX: Joi.string().optional().default('!').min(1).max(5),
        DISCORD_TOKEN: Joi.string().required(),

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
        AUTH_JWT_REFRESH_TOKEN_NOT_BEFORE_EXPIRATION: Joi.string()
          .default('15m')
          .required(),

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
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get('discord.token'),
        prefix: configService.get<string>('discord.prefix'),
        prefixGlobalOptions: { isIgnoreBotMessage: true },
        discordClientOptions: {
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent,
          ],
        },
      }),
    }),
    HttpModule,
    HelperModule,
    ErrorModule,
    DatabaseModule,
    AwsModule,
    PolicyModule,
    AuthModule,
  ],
})
export class CommonModule {}
