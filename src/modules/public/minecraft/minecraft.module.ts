import { Module } from '@nestjs/common';

import { MinecraftService } from './service/minecraft.service';

@Module({
  controllers: [],
  providers: [MinecraftService],
})
export class MinecraftModule {}
