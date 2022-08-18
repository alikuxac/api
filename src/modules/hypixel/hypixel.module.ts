import { Module } from '@nestjs/common';
import { HypixelService } from './hypixel.service';
import { HypixelController } from './hypixel.controller';

@Module({
  controllers: [HypixelController],
  providers: [HypixelService],
})
export class HypixelModule {}
