import { UseInterceptors, applyDecorators } from '@nestjs/common';
import {
  PrefixCommandInterceptor,
  PrefixCommandOptions,
} from '@discord-nestjs/common';

export function PrefixCommand(
  commandName: string,
  options?: PrefixCommandOptions,
) {
  return applyDecorators(
    UseInterceptors(
      new PrefixCommandInterceptor(commandName, {
        isIgnoreBotMessage: true,
        ...options,
      }),
    ),
  );
}
