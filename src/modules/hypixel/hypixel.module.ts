import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SharedModule } from '@shared';

import { HypixelService } from './hypixel.service';
import { HypixelController } from './hypixel.controller';

@Module({
  imports: [HttpModule, SharedModule],
  controllers: [HypixelController],
  providers: [HypixelService],
})
export class HypixelModule {}
