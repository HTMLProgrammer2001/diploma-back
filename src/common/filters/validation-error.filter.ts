import {ArgumentsHost, BadRequestException, Catch} from '@nestjs/common';
import {GqlExceptionFilter} from '@nestjs/graphql';
import {BaseError} from '../class/base-error';
import {ErrorCodesEnum} from '../constants/error-codes.enum';

@Catch(BadRequestException)
export class ValidationErrorFilter implements GqlExceptionFilter {
  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const response = exception.getResponse() as any;
    return new BaseError({code: ErrorCodesEnum.VALIDATION, message: response.message.toString()});
  }
}
