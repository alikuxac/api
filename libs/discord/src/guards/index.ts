export * from './ignorebot.guard';
export * from './nodm.guard';
export * from './attachments.guard';
export * from './content.guard';

import { IgnoreBotGuard } from './ignorebot.guard';
import { NoDMGuard } from './nodm.guard';
import { HaveAttachmentGuard, NoAttachmentGuard } from './attachments.guard';
import { NoContentGuard, ContentGuard } from './content.guard';

export const Guard = [
  IgnoreBotGuard,
  NoDMGuard,
  HaveAttachmentGuard,
  NoAttachmentGuard,
  NoContentGuard,
  ContentGuard,
];
