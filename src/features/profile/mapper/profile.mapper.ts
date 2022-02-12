import {Injectable} from '@nestjs/common';
import {isNil} from 'lodash';
import {UserGetRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-get.repo-request';
import {UserDbModel} from '../../../data-layer/db-models/user.db-model';
import {ProfileResponse} from '../types/response/profile.response';
import {EditProfileRequest} from '../types/request/edit-profile.request';
import {UserDeleteRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-delete.repo-request';
import {UserUpdateRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-update.repo-request';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileMapper {
  profileDbModelToResponse(source: UserDbModel): ProfileResponse {
    const destination = new ProfileResponse();

    destination.id = source.id;
    destination.fullName = source.fullName;
    destination.avatarUrl = source.avatarUrl;
    destination.email = source.email;
    destination.phone = source.phone;
    destination.guid = source.guid;
    destination.isDeleted = source.isDeleted;

    if (!isNil(source.role)) {
      destination.role = {
        id: source.role.id,
        name: source.role.name
      }
    }

    return destination;
  }

  getProfileRepoRequest(id: number, select: Array<string>): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.id = id;
    destination.select = select;
    destination.showDeleted = false;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  initializeGetProfileRepoRequest(id: number, select: Array<string>): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.id = id
    destination.select = select;
    destination.showDeleted = true;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  updateProfileRequestToRepoRequest(id: number, source: EditProfileRequest, avatarUrl: string): UserUpdateRepoRequest {
    const destination = new UserUpdateRepoRequest();

    destination.id = id;
    destination.fullName = source.fullName;
    destination.email = source.email;
    destination.phone = source.phone;
    destination.avatarUrl = avatarUrl;
    destination.passwordHash = bcrypt.hashSync(source.password, Number(process.env.SALT));

    return destination;
  }

  deleteProfileRequestToRepoRequest(id: number): UserDeleteRepoRequest {
    const destination = new UserDeleteRepoRequest();

    destination.id = id;

    return destination;
  }
}
