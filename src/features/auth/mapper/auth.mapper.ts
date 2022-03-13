import {Injectable} from '@nestjs/common';
import {RefreshTokenCreateRepoRequest} from '../../../data-layer/repositories/refresh-token/repo-request/refresh-token-create.repo-request';
import {RefreshTokenGetRepoRequest} from '../../../data-layer/repositories/refresh-token/repo-request/refresh-token-get-repo.request';
import {RefreshTokenDeleteRepoRequest} from '../../../data-layer/repositories/refresh-token/repo-request/refresh-token-delete.repo-request';
import {RefreshTokenUpdateRepoRequest} from '../../../data-layer/repositories/refresh-token/repo-request/refresh-token-update.repo-request';
import {UserGetRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-get.repo-request';
import {UserSelectFieldsEnum} from '../../../data-layer/repositories/user/enums/user-select-fields.enum';
import {TeacherGetRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-get.repo-request';
import {TeacherSelectFieldsEnum} from '../../../data-layer/repositories/teacher/enums/teacher-select-fields.enum';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class AuthMapper {
  constructor(private configService: ConfigService) {}

  initializeGetUserByEmailRepoRequest(email: string): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.emailEqual = email;
    destination.select = [
      UserSelectFieldsEnum.ID,
      UserSelectFieldsEnum.IS_DELETED,
      UserSelectFieldsEnum.PASSWORD_HASH,
      UserSelectFieldsEnum.ROLE_ID,
      UserSelectFieldsEnum.EMAIL,
      UserSelectFieldsEnum.FULL_NAME,
      UserSelectFieldsEnum.AVATAR_URL,
    ];
    destination.showDeleted = false;

    return destination;
  }

  loginRequestToCreateRefreshTokenRepoRequest(userId: number, sessionCode: string): RefreshTokenCreateRepoRequest {
    const destination = new RefreshTokenCreateRepoRequest();

    destination.userId = userId;
    destination.sessionCode = sessionCode;
    destination.expirationTime = new Date(Date.now() +
      Number(this.configService.get('JWT_REFRESH_TOKEN_TTL_SECONDS')) * 1000).toISOString();

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
    destination.select = [
      UserSelectFieldsEnum.ID,
      UserSelectFieldsEnum.IS_DELETED,
      UserSelectFieldsEnum.ROLE_ID,
      UserSelectFieldsEnum.EMAIL,
      UserSelectFieldsEnum.FULL_NAME,
      UserSelectFieldsEnum.AVATAR_URL,
    ];

    return destination;
  }

  refreshTokenRequestToUpdateRefreshTokenRepoRequest(currentSessionCode: string, newSessionCode: string):
    RefreshTokenUpdateRepoRequest {
    const destination = new RefreshTokenUpdateRepoRequest();

    destination.currentSessionCode = currentSessionCode;
    destination.newSessionCode = newSessionCode;
    destination.expirationTime = new Date(Date.now() +
      Number(this.configService.get('JWT_REFRESH_TOKEN_TTL_SECONDS')) * 1000).toISOString();

    return destination;
  }

  initializeGetTeacherByEmailRepoRequest(email: string): TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    destination.select = [
      TeacherSelectFieldsEnum.ID,
      TeacherSelectFieldsEnum.EMAIL,
      TeacherSelectFieldsEnum.FULL_NAME,
      TeacherSelectFieldsEnum.AVATAR_URL
    ];
    destination.emailEqual = email;

    return destination;
  }
}
