import { Module } from '@nestjs/common';
import { HypixelService } from './hypixel.service';

@Module({
  providers: [HypixelService],
  exports: [HypixelService],
})
export class HypixelModule {}
