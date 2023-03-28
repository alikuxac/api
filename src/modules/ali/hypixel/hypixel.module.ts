import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { HypixelService } from './services/hypixel.service';
import { HypixelController } from './controllers/hypixel.controller';

@Module({
  imports: [HttpModule],
  controllers: [HypixelController],
  providers: [HypixelService],
})
export class HypixelModule {}
