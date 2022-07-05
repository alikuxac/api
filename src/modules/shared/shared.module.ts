import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { RedisService } from './redis/redis.service';
@Global()
@Module({
  imports: [
    HttpModule,
    ConfigModule,
    PassportModule,
    // Postgresql
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        name: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '../../**/*.entity.{ts,js}'],
        synchronize: process.env.NODE_ENV !== 'production',
      }),
    }),
    // MySQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        name: 'mysql',
        host: config.get<string>('MYSQL_HOST'),
        // port: config.get<number>('MYSQL_PORT'),
        username: config.get<string>('MYSQL_USER'),
        password: config.get<string>('MYSQL_PASSWORD'),
        database: config.get<string>('MYSQL_NAME'),
        entities: [__dirname + '../../**/*.entity.{ts,js}'],
        synchronize: process.env.NODE_ENV !== 'production',
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
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class SharedModule {}
