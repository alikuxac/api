import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 } from 'uuid';
import { Response, NextFunction } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  async use(req: any, _res: Response, next: NextFunction) {
    req.__id = v4();
    next();
  }
}
