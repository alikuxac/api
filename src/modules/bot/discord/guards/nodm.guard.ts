import { DiscordGuard } from '@discord-nestjs/core';
import { Message, Events } from 'discord.js';

export class NoDMGuard implements DiscordGuard {
  canActive(event: Events.MessageCreate, [message]: [Message]) {
    return !message.guild;
  }
}
