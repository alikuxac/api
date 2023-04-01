import { Module } from '@nestjs/common';
// import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './controller/app.controller';
import { AppService } from './services/app.service';

import { CommonModule } from 'src/common/common.module';
import { RoutersModule } from 'src/routers/routers.module';
import { BootstrapModule } from 'src/modules/system/bootstrap/bootstrap.module';
import { CoreModule } from 'src/modules/system/core/core.module';
import { DiscordModule } from '@discord-nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GatewayIntentBits } from 'discord.js';

@Module({
  imports: [
    CommonModule,
    BootstrapModule,
    RoutersModule,
    CoreModule,
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get('DISCORD_TOKEN'),
        prefix: configService.get<string>('DISCORD_PREFIX'),
        prefixGlobalOptions: { isIgnoreBotMessage: true },
        discordClientOptions: {
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent,
          ],
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
