import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';

// only for response success and error in controller
@Injectable()
export class ResponseCustomHeadersInterceptor
  implements NestInterceptor<Promise<any>>
{
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any> | string>> {
    const arg0 = context.getArgByIndex(0);
    // console.log(arg0);
    if (context.getType() === 'http' || !arg0.user) {
      const ctx: HttpArgumentsHost = context.switchToHttp();
      const responseExpress: Response = ctx.getResponse();
      const request: IRequestApp = ctx.getRequest();

      responseExpress.setHeader('x-custom-lang', request.__xCustomLang);
      responseExpress.setHeader(
        'x-timestamp',
        request.__xTimestamp ?? request.__timestamp,
      );
      responseExpress.setHeader('x-timezone', request.__timezone);
      responseExpress.setHeader('x-request-id', request.__id);

      return next.handle();
    }

    return next.handle();
  }
}
