import {Injectable, Logger, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import {CustomError} from '../class/custom-error';

@Injectable()
export class StaticAuthorizationHeaderMiddleware implements NestMiddleware {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(StaticAuthorizationHeaderMiddleware.name);
  }

  use(req: Request, res: Response, next: NextFunction) {
    try {
      req.headers['authorization'] = req.headers['authorization'] ?? req.query.token.toString();
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
      }
    }

    next();
  }
}
