import { Injectable, Logger } from '@nestjs/common';
import { InjectDiscordClient, Once, On } from '@discord-nestjs/core';
import { Client, Events } from 'discord.js';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger('AliBot');

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Once(Events.ClientReady)
  async onClientReady() {
    this.logger.log('Client ready');
  }

  @On(Events.Error)
  onError(error: Error) {
    this.logger.error(error);
  }

  @On(Events.Warn)
  onWarn(warn: string) {
    this.logger.warn(warn);
  }

  @On(Events.Debug)
  onDebug(info: string) {
    this.logger.debug(info);
  }
}
