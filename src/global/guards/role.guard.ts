import {CanActivate, ExecutionContext, Injectable, Logger} from '@nestjs/common';
import {Observable} from 'rxjs';
import {GqlExecutionContext} from '@nestjs/graphql';
import {JwtService} from '@nestjs/jwt';
import {IAccessTokenInfoInterface} from '../types/interface/IAccessTokenInfo.interface';
import {CustomError} from '../class/custom-error';
import {ErrorCodesEnum} from '../constants/error-codes.enum';
import {Reflector} from '@nestjs/core';
import {MetaDataFieldEnum} from '../constants/meta-data-fields.enum';
import {RolesEnum} from '../constants/roles.enum';
import {isNil} from 'lodash';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class RoleGuard implements CanActivate {
  private logger: Logger;

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    this.logger = new Logger(RoleGuard.name);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const roles = this.reflector.get<Array<RolesEnum>>(MetaDataFieldEnum.ROLES, gqlContext.getHandler());

    if (!isNil(roles)) {
      const token = context.getType() === 'http' ?
        context.switchToHttp().getRequest().headers['authorization'] :
        gqlContext.getContext().req.headers['authorization'];

      try {
        const payload = this.jwtService.verify<IAccessTokenInfoInterface>(
          token,
          {secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET')}
        );

        if (roles.includes(payload.role)) {
          return true;
        } else {
          const error = new CustomError({
            code: ErrorCodesEnum.FORBID,
            message: 'You have not access to do this'
          });

          this.logger.error(error);
          throw error;
        }
      } catch (e) {
        if (!(e instanceof CustomError)) {
          this.logger.error(e);
          throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
        }

        throw e;
      }
    } else {
      return true;
    }
  }
}
