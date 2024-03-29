import { Module } from '@nestjs/common';

import { AppController } from './controller/app.controller';
import { AppService } from './services/app.service';

import { CommonModule } from 'src/common/common.module';
import { RoutersModule } from 'src/routers/routers.module';
import { BotDiscordModule } from '@root/modules/bot/discord';

@Module({
  imports: [CommonModule, RoutersModule, BotDiscordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
