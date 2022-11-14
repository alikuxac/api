import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BotGateway } from './bot.gateway';
import { DiscordModule } from '@discord-nestjs/core';
import { StickRole, StickRoleSchema } from './entities';

import { Commands } from './commands';

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
