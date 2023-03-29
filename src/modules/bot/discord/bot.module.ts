import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BotGateway } from './bot.gateway';
import { DiscordModule } from '@discord-nestjs/core';

import { controllerArray } from './controllers';
import { Commands } from './commands';
import { Events } from './events';
import { Guard } from './guards';
import {
  StickRole,
  StickRoleSchema,
  DiscordEval,
  DiscordEvalSchema,
} from './entities';

@Module({
  imports: [
    DiscordModule.forFeature(),
    MongooseModule.forFeature(
      [
        { name: StickRole.name, schema: StickRoleSchema },
        { name: DiscordEval.name, schema: DiscordEvalSchema },
      ],
      'api',
    ),
  ],
  controllers: [...controllerArray],
  providers: [BotGateway, ...Commands, ...Events, ...Guard],
})
export class BotModule {}
