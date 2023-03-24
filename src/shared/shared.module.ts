import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { RedisService } from './services/redis.service';
import { B2Service } from './services/b2.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [B2Service, RedisService],
  exports: [B2Service, RedisService],
})
export class SharedModule {}
