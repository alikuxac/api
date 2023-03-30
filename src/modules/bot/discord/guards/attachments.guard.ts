import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Message } from 'discord.js';

export class NoAttachmentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const message = context.getArgByIndex(0) as Message;

    return message.attachments.size === 0;
  }
}

export class HaveAttachmentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const message = context.getArgByIndex(0) as Message;

    return message.attachments.size > 0;
  }
}
