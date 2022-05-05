import { Module } from '@nestjs/common';

import { SharedModule } from 'modules/shared/shared.module';

// Controller
import { MinecraftController } from './minecraft/minecraft.controller';
import { TextController } from './text/text.controller';

// Sevice
import { MinecraftService } from './minecraft/minecraft.service';
import { TextService } from './text/text.service';

@Module({
  imports: [
    SharedModule,
  controllers: [
    MinecraftController,
    TextController,
  ],
  providers: [MinecraftService, TextService],
})
export class PublicModule {}
