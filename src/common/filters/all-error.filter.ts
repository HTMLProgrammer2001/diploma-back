import {ArgumentsHost, Catch} from '@nestjs/common';
import {GqlExceptionFilter} from '@nestjs/graphql';
import {BaseError} from '../class/base-error';
import {ErrorCodesEnum} from '../constants/error-codes.enum';

@Catch(Error)
export class AllErrorFilter implements GqlExceptionFilter {
  async catch(exception: Error, host: ArgumentsHost) {
    if(exception instanceof BaseError) {
      return exception;
    }
    else {
      return new BaseError({code: ErrorCodesEnum.GENERAL, message: exception.message});
    }
  }
}
