import { DiscordGuard } from '@discord-nestjs/core';
import { Message, Events } from 'discord.js';

export class IgnoreBotGuard implements DiscordGuard {
  canActive(event: Events.MessageCreate, [message]: [Message]) {
    return !message.author.bot;
  }
}
