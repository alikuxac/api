import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectDiscordClient, Once } from '@discord-nestjs/core';
import { Client, Events } from 'discord.js';

@Injectable()
export class BotGateway implements OnModuleInit {
  private readonly logger = new Logger('DiscordBot');

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  onModuleInit() {
    this.client.on(Events.Debug, (info) => {
      this.onDebug(info);
    });

    this.client.on(Events.Error, (error) => {
      this.onError(error);
    });

    this.client.on(Events.Warn, (warn) => {
      this.onWarn(warn);
    });
  }

  @Once(Events.ClientReady)
  async onClientReady() {
    this.client.setMaxListeners(50);
    this.logger.log('Client ready');
  }

  onError(error: Error) {
    this.logger.error(error);
  }

  onWarn(warn: string) {
    this.logger.warn(warn);
  }

  onDebug(info: string) {
    this.logger.debug(info);
  }
}
