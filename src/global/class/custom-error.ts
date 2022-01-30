import {IError} from '../types/interface/IError.interface';
import {ErrorCodesEnum} from '../constants/error-codes.enum';

export class CustomError extends Error {
  public code: ErrorCodesEnum;

  constructor(error: IError) {
    super();

    this.message = error.message;
    this.code = error.code;
  }
}
