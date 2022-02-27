import {Catch, ExecutionContext} from '@nestjs/common';
import {GqlExceptionFilter} from '@nestjs/graphql';
import {CustomError} from '../class/custom-error';
import {ErrorCodesEnum} from '../constants/error-codes.enum';

@Catch(Error)
export class AllErrorFilter implements GqlExceptionFilter {
  async catch(exception: Error, host: ExecutionContext) {
    const formattedError = exception instanceof CustomError ? exception : new CustomError({
      code: ErrorCodesEnum.GENERAL,
      message: exception.message
    });

    if(host.getType() === 'http') {
      const res = host.switchToHttp().getResponse();
      return res.json({errors: [formattedError], data: null});
    }
    else {
      return formattedError;
    }
  }
}
