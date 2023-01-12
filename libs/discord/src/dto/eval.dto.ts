import { Param, ParamType } from '@discord-nestjs/core';

export class EvalDto {
  @Param({
    name: 'code',
    type: ParamType.STRING,
    required: true,
    description: 'Code to eval',
  })
  code: string;
}
