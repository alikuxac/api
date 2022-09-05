import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BotGateway } from './bot.gateway';
import { DiscordModule } from '@discord-nestjs/core';
import { StickRole, StickRoleSchema } from './entities/';

import { PingCommand } from './commands';

@Module({
  imports: [
    DiscordModule.forFeature(),
    MongooseModule.forFeature(
      [{ name: StickRole.name, schema: StickRoleSchema }],
      'discordbot',
    ),
  ],
  providers: [BotGateway, PingCommand],
})
export class BotModule {}
