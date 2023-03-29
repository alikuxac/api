import { DiscordGuard } from '@discord-nestjs/core';
import { Message, Events } from 'discord.js';

export class NoContentGuard implements DiscordGuard {
  canActive(event: Events.MessageCreate, [message]: [Message]) {
    return !message.content;
  }
}

export class ContentGuard implements DiscordGuard {
  canActive(event: Events.MessageCreate, [message]: [Message]) {
    return message.content.length > 0;
  }
}
