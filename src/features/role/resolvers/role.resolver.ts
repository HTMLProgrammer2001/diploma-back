import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {RoleService} from '../service/role.service';
import {RoleGetListRequest} from '../types/request/role-get-list.request';
import {RoleResponse} from '../types/response/role.response';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {RoleListResponse} from '../types/response/role-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsList} from 'graphql-fields-list';
import {RoleGetByIdRequest} from '../types/request/role-get-by-id.request';

@Resolver(of => RoleResponse)
export class RoleResolver {
  constructor(private roleService: RoleService) {}

  @Query(returns => RoleListResponse)
  async getRoleList(@Args() request: RoleGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<RoleResponse>> {
    request.select = fieldsList(info, {path: 'responseList'});
    return this.roleService.getRoleList(request);
  }

  @Query(returns => RoleResponse)
  async getRoleById(@Args() request: RoleGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<RoleResponse> {
    request.select = fieldsList(info);
    return this.roleService.getRoleById(request);
  }
}
