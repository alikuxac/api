import { Request } from 'express';
import { IResult } from 'ua-parser-js';
import { RequestPaginationSerialization } from '../serializations/request.pagination.serialization';

export interface IRequestApp extends Request {
  user?: Record<string, any>;

  __userAgent: IResult;
  __id: string;
  __xTimestamp?: number;
  __timestamp: number;
  __timezone: string;
  __customLang: string[];
  __xCustomLang: string;

  __class?: string;
  __function?: string;

  __pagination?: RequestPaginationSerialization;
}
