import {Injectable, Scope} from '@nestjs/common';

@Injectable({scope: Scope.REQUEST})
export class RequestContext {
  private _token: string;

  setToken(token: string) {
    this._token = token;
  }

  getToken(): string {
    return this._token;
  }
}
