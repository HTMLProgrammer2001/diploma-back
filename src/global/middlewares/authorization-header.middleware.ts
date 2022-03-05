import {Injectable, Logger, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import {RequestContext} from '../services/request-context';
import {JwtService} from '@nestjs/jwt';
import {IAccessTokenInfoInterface} from '../types/interface/IAccessTokenInfo.interface';
import {CustomError} from '../class/custom-error';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class AuthorizationHeaderMiddleware implements NestMiddleware {
  private logger: Logger;

  constructor(
    private requestContext: RequestContext,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.logger = new Logger(AuthorizationHeaderMiddleware.name);
  }

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header('authorization');

      if (token) {
        const payload = this.jwtService.verify<IAccessTokenInfoInterface>(token, {
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET')
        });

        this.requestContext.setToken(token);
        this.requestContext.setUserId(payload.userId);
        this.requestContext.setUserRole(payload.role);
      }
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
      }
    }

    next();
  }
}
