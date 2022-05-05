import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
@Global()
@Module({
  imports: [
    HttpModule,
    ConfigModule,
    PassportModule,
})
export class SharedModule {}
