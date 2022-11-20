import { Module } from '@nestjs/common';

import { MinecraftModule } from './minecraft/minecraft.module';
import { TextModule } from './text/text.module';
import { HypixelModule } from './hypixel/hypixel.module';
import { FunModule } from './fun/fun.module';

@Module({
  imports: [MinecraftModule, TextModule, HypixelModule, FunModule],
})
export class PublicModule {}
