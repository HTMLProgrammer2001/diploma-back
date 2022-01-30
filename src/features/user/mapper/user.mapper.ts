import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {UserGetListRequest} from '../types/request/user-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {UserResponse} from '../types/response/user.response';
import {UserGetByIdRequest} from '../types/request/user-get-by-id.request';
import {UserCreateRequest} from '../types/request/user-create.request';
import {UserUpdateRequest} from '../types/request/user-update.request';
import {UserGetRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-get.repo-request';
import {UserDbModel} from '../../../data-layer/db-models/user.db-model';
import {UserCreateRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-create.repo-request';
import {UserUpdateRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-update.repo-request';
import {UserDeleteRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-delete.repo-request';
import {RoleGetRepoRequest} from '../../../data-layer/repositories/role/repo-request/role-get.repo-request';
import {RoleSelectFieldsEnum} from '../../../data-layer/repositories/role/enums/role-select-fields.enum';
import {UserSelectFieldsEnum} from '../../../data-layer/repositories/user/enums/user-select-fields.enum';

@Injectable()
export class UserMapper {
  getUserListRequestToRepoRequest(source: UserGetListRequest): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.fullName = source.fullName;
    destination.email = source.email;
    destination.roleId = source.roleId;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  userPaginatorDbModelToResponse(source: IPaginator<UserDbModel>): IPaginator<UserResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.userDbModelToResponse(el))
    };
  }

  userDbModelToResponse(source: UserDbModel): UserResponse {
    const destination = new UserResponse();

    destination.id = source.id;
    destination.fullName = source.fullName;
    destination.email = source.email;
    destination.phone = source.phone;
    destination.avatarUrl = source.avatarUrl;
    destination.isDeleted = source.isDeleted;
    destination.guid = source.guid;

    if(source.role) {
      destination.role = {
        id: source.role.id,
        name: source.role.name
      };
    }

    return destination;
  }

  getUserByIdRequestToRepoRequest(source: UserGetByIdRequest): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  initializeGetUserByIdRepoRequest(id: number, select: Array<string>): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.id = id;
    destination.select = select;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createUserRequestToRepoRequest(source: UserCreateRequest, avatarUrl: string): UserCreateRepoRequest {
    const destination = new UserCreateRepoRequest();

    destination.fullName = source.fullName;
    destination.email = source.email;
    destination.phone = source.phone;
    destination.avatarUrl = avatarUrl;
    destination.roleId = source.roleId;
    destination.passwordHash = bcrypt.hashSync(source.password, Number(process.env.SALT));

    return destination;
  }

  initializeGetUserByEmailRepoRequest(email: string): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.emailEqual = email;
    destination.select = [UserSelectFieldsEnum.ID];
    destination.showDeleted = false;

    return destination;
  }

  initializeGetUserByPhoneRepoRequest(phone: string): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.phoneEqual = phone;
    destination.select = [UserSelectFieldsEnum.ID];
    destination.showDeleted = false;

    return destination;
  }

  initializeGetRoleRepoRequest(roleId: number): RoleGetRepoRequest {
    const destination = new RoleGetRepoRequest();

    destination.id = roleId;
    destination.select = [RoleSelectFieldsEnum.ID];
    destination.showDeleted = true;

    return destination;
  }

  updateUserRequestToRepoRequest(source: UserUpdateRequest, avatarUrl: string): UserUpdateRepoRequest {
    const destination = new UserUpdateRepoRequest();

    destination.id = source.id;
    destination.fullName = source.fullName;
    destination.email = source.email;
    destination.phone = source.phone;
    destination.avatarUrl = avatarUrl;
    destination.roleId = source.roleId;

    if(source.password) {
      destination.passwordHash = bcrypt.hashSync(source.password, Number(process.env.SALT));
    }

    return destination;
  }

  deleteUserRequestToRepoRequest(id: number): UserDeleteRepoRequest {
    const destination = new UserDeleteRepoRequest();

    destination.id = id;

    return destination;
  }
}
