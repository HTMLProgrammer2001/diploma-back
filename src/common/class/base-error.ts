import {IError} from '../types/interface/IError.interface';

export class BaseError extends Error {
  public errors: Array<IError> = [];

  constructor(public error: IError = null, e: Error = null) {
    super();
    if (e){
      this.name = e.name;
      this.message = e.message;
      this.stack = e.stack;
    }

    if (error){
      this.message = error.message;
      this.errors.push(error);
    }
  }
}
