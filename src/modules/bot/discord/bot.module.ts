import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BotGateway } from './bot.gateway';
import { DiscordModule } from '@discord-nestjs/core';

// import { controllerArray } from './controllers';
import { Commands } from './commands';
import { Events } from './events';
import {
  StickRole,
  StickRoleSchema,
  DiscordEval,
  DiscordEvalSchema,
  DiscordGuild,
  DiscordGuildSchema,
} from './entities';

import { StickRoleService } from './services';

@Module({
  imports: [
    DiscordModule.forFeature(),
    MongooseModule.forFeature(
      [
        { name: StickRole.name, schema: StickRoleSchema },
        { name: DiscordEval.name, schema: DiscordEvalSchema },
        { name: DiscordGuild.name, schema: DiscordGuildSchema },
      ],
      'api',
    ),
  ],
  controllers: [],
  providers: [
    { provide: BotGateway, useClass: BotGateway },
    ...Commands,
    ...Events,
    StickRoleService,
  ],
})
export class BotDiscordModule {}
