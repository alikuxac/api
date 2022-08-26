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
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),

    // MongoDB Ali-Bot
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      connectionName: 'discordbot',
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
        dbName: 'discordbot',
      }),
    }),

    // MongoDB Ali-API
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      connectionName: 'api',
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGO_URI'),
        dbName: 'api',
      }),
    }),

    // MongoDB Forum
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      connectionName: 'forum',
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGO_URI'),
        dbName: 'forum',
      }),
    }),

    // MongoDB Finance
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      connectionName: 'finance',
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGO_URI'),
        dbName: 'finance',
      }),
    }),
  ],
  providers: [RedisService, B2Service, R2Service],
  exports: [RedisService, B2Service, R2Service],
})
export class SharedModule {}
