import { DiscordGuard } from '@discord-nestjs/core';
import { Message, Events } from 'discord.js';

export class NoAttachmentGuard implements DiscordGuard {
  canActive(event: Events.MessageCreate, [message]: [Message]) {
    return message.attachments.size > 0;
  }
}

export class HaveAttachmentGuard implements DiscordGuard {
  canActive(event: Events.MessageCreate, [message]: [Message]) {
    return message.attachments.size === 0;
  }
}
