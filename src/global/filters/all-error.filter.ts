import {ArgumentsHost, Catch} from '@nestjs/common';
import {GqlExceptionFilter} from '@nestjs/graphql';
import {CustomError} from '../class/custom-error';
import {ErrorCodesEnum} from '../constants/error-codes.enum';

@Catch(Error)
export class AllErrorFilter implements GqlExceptionFilter {
  async catch(exception: Error, host: ArgumentsHost) {
    if(exception instanceof CustomError) {
      return exception;
    }
    else {
      return new CustomError({code: ErrorCodesEnum.GENERAL, message: exception.message});
    }
  }
}
