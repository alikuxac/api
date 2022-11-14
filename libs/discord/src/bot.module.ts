import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BotGateway } from './bot.gateway';
import { DiscordModule } from '@discord-nestjs/core';

import { Commands } from './commands';
import { StickRole, StickRoleSchema } from './entities';

@Module({
  imports: [
    DiscordModule.forFeature(),
    MongooseModule.forFeature(
      [{ name: StickRole.name, schema: StickRoleSchema }],
      'api',
    ),
  ],
  providers: [BotGateway, ...Commands],
})
export class BotModule {}
