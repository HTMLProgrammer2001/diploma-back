import {Injectable} from '@nestjs/common';
import {UserGetRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-get.repo-request';
import {UserSelectFieldsEnum} from '../../../data-layer/repositories/user/enums/user-select-fields.enum';
import {TokenCreateRepoRequest} from '../../../data-layer/repositories/token/repo-request/token-create.repo-request';

@Injectable()
export class AuthMapper {
  initializeGetUserByEmailRepoRequest(email: string): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.email = email;
    destination.select = [UserSelectFieldsEnum.ID, UserSelectFieldsEnum.IS_DELETED, UserSelectFieldsEnum.PASSWORD_HASH];
    destination.showDeleted = false;

    return destination;
  }

  loginRequestToCreateTokenRepoRequest(userId: number, token: string): TokenCreateRepoRequest {
    const destination = new TokenCreateRepoRequest();

    destination.userId = userId;
    destination.token = token;

    return destination;
  }
}
