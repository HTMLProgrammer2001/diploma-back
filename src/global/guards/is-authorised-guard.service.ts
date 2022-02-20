import {GqlExecutionContext} from '@nestjs/graphql';
import {Reflector} from '@nestjs/core';
import {CanActivate, ExecutionContext, Injectable, Logger} from '@nestjs/common';
import {Observable} from 'rxjs';
import {JwtService} from '@nestjs/jwt';
import {isNil} from 'lodash';
import {IAccessTokenInfoInterface} from '../types/interface/IAccessTokenInfo.interface';
import {CustomError} from '../class/custom-error';
import {ErrorCodesEnum} from '../constants/error-codes.enum';
import {MetaDataFieldEnum} from '../constants/meta-data-fields.enum';
import {AccessTokenTypeEnum} from '../constants/access-token-type.enum';

@Injectable()
export class IsAuthorisedGuard implements CanActivate {
  private logger: Logger;

  constructor(private jwtService: JwtService, private reflector: Reflector) {
    this.logger = new Logger();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext = GqlExecutionContext.create(context);

    const isAuthorized = this.reflector.get<boolean>(MetaDataFieldEnum.IS_CHECK_AUTHORIZATION, gqlContext.getHandler());
    if (isAuthorized || isNil(isAuthorized)) {
      const token = gqlContext.getContext().req.headers['authorization'];
      try {
        const isTeacherHasAccess = this.reflector.get<boolean>(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, gqlContext.getHandler());
        const payload = this.jwtService.verify<IAccessTokenInfoInterface>(
          token,
          {secret: process.env.JWT_ACCESS_TOKEN_SECRET}
        );

        const canActivate = !!payload.userId && (isTeacherHasAccess || payload.type === AccessTokenTypeEnum.user);

        if(!canActivate) {
          this.logger.debug(`Not authorized access to ${gqlContext.getHandler().name}`);
        }

        return canActivate;
      } catch (e) {
        throw new CustomError({
          code: ErrorCodesEnum.UNAUTHORIZED,
          message: e.message
        })
      }
    } else {
      return true;
    }
  }
}
