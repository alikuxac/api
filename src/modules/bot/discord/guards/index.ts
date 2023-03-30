export * from './ignorebot.guard';
export * from './nodm.guard';
export * from './attachments.guard';
export * from './content.guard';

import { MessageFromUserGuard } from './ignorebot.guard';
import { MessageGuildGuard } from './nodm.guard';
import { HaveAttachmentGuard, NoAttachmentGuard } from './attachments.guard';
import { NoContentGuard, ContentGuard } from './content.guard';

export const Guard = [
  MessageFromUserGuard,
  MessageGuildGuard,
  HaveAttachmentGuard,
  NoAttachmentGuard,
  NoContentGuard,
  ContentGuard,
];
