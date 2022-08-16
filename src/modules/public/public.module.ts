import { Module } from '@nestjs/common';

// Module
import { SharedModule } from '@shared/shared.module';
import { MinecraftModule } from './minecraft/minecraft.module';
import { TextModule } from './text/text.module';

@Module({
  imports: [SharedModule, MinecraftModule, TextModule],
})
export class PublicModule {}
