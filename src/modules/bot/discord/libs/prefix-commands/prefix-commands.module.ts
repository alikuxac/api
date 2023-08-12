import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { DiscordModule } from '@discord-nestjs/core';
import { PrefixCommandExplorer } from './explorers/prefix-command.explorer';

@Module({
  imports: [DiscoveryModule, DiscordModule.forFeature()],
  providers: [{ provide: 'DiscordBot', useClass: PrefixCommandExplorer }],
})
export class PrefixCommandModule {}
