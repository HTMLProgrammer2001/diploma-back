import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {RequestContext} from '../services/request-context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private requestContext: RequestContext) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.requestContext.setToken(req.header('Authorization'));
    next();
  }
}
