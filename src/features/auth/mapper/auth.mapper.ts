import {Injectable} from '@nestjs/common';
import {RefreshTokenCreateRepoRequest} from '../../../data-layer/repositories/refresh-token/repo-request/refresh-token-create.repo-request';
import {RefreshTokenGetRepoRequest} from '../../../data-layer/repositories/refresh-token/repo-request/refresh-token-get-repo.request';
import {RefreshTokenDeleteRepoRequest} from '../../../data-layer/repositories/refresh-token/repo-request/refresh-token-delete.repo-request';
import {RefreshTokenUpdateRepoRequest} from '../../../data-layer/repositories/refresh-token/repo-request/refresh-token-update.repo-request';
import {UserGetRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-get.repo-request';
import {UserSelectFieldsEnum} from '../../../data-layer/repositories/user/enums/user-select-fields.enum';

@Injectable()
export class AuthMapper {
  initializeGetUserByEmailRepoRequest(email: string): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.emailEqual = email;
    destination.select = [
      UserSelectFieldsEnum.ID,
      UserSelectFieldsEnum.IS_DELETED,
      UserSelectFieldsEnum.PASSWORD_HASH,
      UserSelectFieldsEnum.ROLE_ID
    ];
    destination.showDeleted = false;

    return destination;
  }

  loginRequestToCreateRefreshTokenRepoRequest(userId: number, sessionCode: string): RefreshTokenCreateRepoRequest {
    const destination = new RefreshTokenCreateRepoRequest();

    destination.userId = userId;
    destination.sessionCode = sessionCode;
    destination.expirationTime = new Date(Date.now() + Number(process.env.JWT_REFRESH_TOKEN_TTL_SECONDS) * 1000).toISOString();

    return destination;
  }

  initializeGetRefreshTokenRepoRequest(sessionCode: string): RefreshTokenGetRepoRequest {
    const destination = new RefreshTokenGetRepoRequest();

    destination.sessionCode = sessionCode;

    return destination;
  }

  logoutRequestToDeleteRefreshTokenRepoRequest(sessionCode: string): RefreshTokenDeleteRepoRequest {
    const destination = new RefreshTokenDeleteRepoRequest();

    destination.sessionCode = sessionCode;

    return destination;
  }

  initializeGetUserByIdRepoRequest(id: number): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.id = id;
    destination.select = [UserSelectFieldsEnum.ID, UserSelectFieldsEnum.IS_DELETED];

    return destination;
  }

  refreshTokenRequestToUpdateRefreshTokenRepoRequest(currentSessionCode: string, newSessionCode: string):
    RefreshTokenUpdateRepoRequest {
    const destination = new RefreshTokenUpdateRepoRequest();

    destination.currentSessionCode = currentSessionCode;
    destination.newSessionCode = newSessionCode;
    destination.expirationTime = new Date(Date.now() + Number(process.env.JWT_REFRESH_TOKEN_TTL_SECONDS) * 1000).toISOString();

    return destination;
  }
}
