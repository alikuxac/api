import {
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { IResult } from 'ua-parser-js';

export const RequestUserAgent: () => ParameterDecorator = createParamDecorator(
  (_data: string, ctx: ExecutionContext): IResult => {
    const { __userAgent } = ctx.switchToHttp().getRequest<IRequestApp>();
    return __userAgent;
  },
);

export const RequestId: () => ParameterDecorator = createParamDecorator(
  (_data: string, ctx: ExecutionContext): string => {
    const { __id } = ctx.switchToHttp().getRequest<IRequestApp>();
    return __id;
  },
);

export const RequestXTimestamp: () => ParameterDecorator = createParamDecorator(
  (_data: string, ctx: ExecutionContext): number => {
    const { __xTimestamp } = ctx.switchToHttp().getRequest<IRequestApp>();
    return __xTimestamp;
  },
);

export const RequestTimestamp: () => ParameterDecorator = createParamDecorator(
  (_data: string, ctx: ExecutionContext): number => {
    const { __timestamp } = ctx.switchToHttp().getRequest<IRequestApp>();
    return __timestamp;
  },
);

export const RequestCustomLang: () => ParameterDecorator = createParamDecorator(
  (_data: string, ctx: ExecutionContext): string[] => {
    const { __customLang } = ctx.switchToHttp().getRequest<IRequestApp>();
    return __customLang;
  },
);

export function ThrottleredGuard() {
  return applyDecorators(UseGuards(ThrottlerGuard));
}
