import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Message } from 'discord.js';

export class NoContentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const message = context.getArgByIndex(0) as Message;

    return message.content.length === 0;
  }
}

export class ContentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const message = context.getArgByIndex(0) as Message;

    return message.content.length > 0;
  }
}
