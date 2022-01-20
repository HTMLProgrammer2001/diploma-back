import {IError} from './IError.interface';

export interface IResponse<T> {
  status: 'OK' | 'FAILED';
  errors: Array<IError>;
  data: T;
}
