import { Module } from '@nestjs/common';

import { PrefixCommandExplorer } from './explorers/prefix-command.explorer';

@Module({
  providers: [PrefixCommandExplorer],
})
export class PrefixCommandModule {}
