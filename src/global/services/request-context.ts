import {Injectable, Scope} from '@nestjs/common';
import {RolesEnum} from '../constants/roles.enum';

@Injectable({scope: Scope.REQUEST})
export class RequestContext {
  private _token: string;
  private _userId: number;
  private _userRole: RolesEnum;

  setToken(token: string) {
    this._token = token;
  }

  getToken(): string {
    return this._token;
  }

  setUserId(userId: number) {
    this._userId = userId;
  }

  getUserId(): number {
    return this._userId;
  }

  setUserRole(userRole: RolesEnum) {
    this._userRole = userRole;
  }

  getUserRole(): RolesEnum {
    return this._userRole;
  }
}
