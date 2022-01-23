import {ErrorCodesEnum} from '../constants/error-codes.enum';
import {CustomError} from './custom-error';

export class CustomArrayError extends CustomError {
  constructor(public errors: Array<CustomError> = []) {
    super({
      code: ErrorCodesEnum.ARRAY_ERROR,
      message: 'Array of errors'
    });
  }
}
