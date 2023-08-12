import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

@Injectable()
export class RequestCorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    cors()(req, res, next);
  }
}
