import {Injectable} from '@nestjs/common';
import {RoleGetListRequest} from '../types/request/role-get-list.request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {RoleResponse} from '../types/response/role.response';
import {RoleGetByIdRequest} from '../types/request/role-get-by-id.request';
import {RoleGetRepoRequest} from '../../../data-layer/repositories/role/repo-request/role-get.repo-request';
import {RoleDbModel} from '../../../data-layer/db-models/role.db-model';

@Injectable()
export class RoleMapper {
  getRoleListRequestToRepoRequest(source: RoleGetListRequest): RoleGetRepoRequest {
    const destination = new RoleGetRepoRequest();

    destination.name = source.name;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  rolePaginatorDbModelToResponse(source: IPaginator<RoleDbModel>): IPaginator<RoleResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.roleDbModelToResponse(el))
    };
  }

  roleDbModelToResponse(source: RoleDbModel): RoleResponse {
    const destination = new RoleResponse();

    destination.id = source.id;
    destination.name = source.name;

    return destination;
  }

  getRoleByIdRequestToRepoRequest(source: RoleGetByIdRequest): RoleGetRepoRequest {
    const destination = new RoleGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }
}
