import {Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import {storage} from '../utils/storage';
import {randomUUID} from 'crypto';

@Injectable()
export class SetupRequestStorageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    storage.run({reqId: randomUUID(), ip: req.ip}, () => next());
  }
}
