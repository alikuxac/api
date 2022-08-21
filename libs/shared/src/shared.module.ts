import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { RedisService } from './redis/redis.service';
import { B2Service } from './b2/b2.service';
import { R2Service } from './r2/r2.service';

@Global()
@Module({
  imports: [
    HttpModule,
    ConfigModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),

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
  providers: [RedisService, B2Service, R2Service],
  exports: [RedisService, B2Service, R2Service],
})
export class SharedModule {}
