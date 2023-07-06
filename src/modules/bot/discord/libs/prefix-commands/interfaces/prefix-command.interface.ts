import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Message, MessagePayload, BaseMessageOptions } from 'discord.js';
import { PrefixCommandOptions } from '../decorators/prefix-command.decorator';

export type CommandResult = string | MessagePayload | BaseMessageOptions | void;

export interface IPrefixCommand {
  prefixHandler(
    message: Message,
    args: string[],
  ): Promise<CommandResult | Promise<CommandResult>>;
}

export type DecoratedPrefixCommand<T> = {
  instanceWrapper: InstanceWrapper<T>;
  options: PrefixCommandOptions;
};
