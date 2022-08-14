import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { RedisService } from './redis/redis.service';
@Global()
@Module({
  imports: [
    HttpModule,
    ConfigModule,
    PassportModule,

    // MongoDB Ali-Bot
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
        connectionName: 'discordbot',
        dbName: 'discordbot',
      }),
    }),

    // MongoDB Ali-API
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGO_URI'),
        connectionName: 'api',
        dbName: 'api',
      }),
    }),

    // MongoDB Forum
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGO_URI'),
        connectionName: 'forum',
        dbName: 'forum',
      }),
    }),

    // MongoDB Finance
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGO_URI'),
        connectionName: 'finance',
        dbName: 'finance',
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class SharedModule {}
