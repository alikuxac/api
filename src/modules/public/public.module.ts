import { Module } from '@nestjs/common';

import { MinecraftModule } from './minecraft/minecraft.module';
import { TextModule } from './text/text.module';
import { HypixelModule } from './hypixel/hypixel.module';

@Module({
  imports: [MinecraftModule, TextModule, HypixelModule],
})
export class PublicModule {}
