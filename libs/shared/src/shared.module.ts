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

    // MongoDB Ali-API
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      connectionName: 'api',
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGO_URI'),
        dbName: 'api',
      }),
    }),
  ],
  providers: [RedisService, B2Service, R2Service],
  exports: [RedisService, B2Service, R2Service],
})
export class SharedModule {}
