import {ArgumentsHost, BadRequestException, Catch} from '@nestjs/common';
import {GqlExceptionFilter} from '@nestjs/graphql';
import {ErrorCodesEnum} from '../constants/error-codes.enum';
import {CustomArrayError} from '../class/custom-array-error';

@Catch(BadRequestException)
export class ValidationErrorFilter implements GqlExceptionFilter {
  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const response = exception.getResponse() as any;
    const transformedError = new CustomArrayError();
    transformedError.errors = (Array.isArray(response.message) ? response.message : [response.message]).map(errMsg => ({
      code: ErrorCodesEnum.VALIDATION,
      message: errMsg
    }));

    return transformedError;
  }
}
