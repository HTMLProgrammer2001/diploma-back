import {Args, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
import {RoleService} from '../service/role.service';
import {RoleGetListRequest} from '../types/request/role-get-list.request';
import {RoleResponse} from '../types/response/role.response';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {RoleListResponse} from '../types/response/role-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {RoleGetByIdRequest} from '../types/request/role-get-by-id.request';
import {RoleUpdateRequest} from '../types/request/role-update.request';

@Resolver(of => RoleResponse)
export class RoleResolver {
  constructor(private roleService: RoleService) {}

  @Query(returns => RoleListResponse)
  async getRoleList(@Args() request: RoleGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<RoleResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.roleService.getRoleList(request);
  }

  @Query(returns => RoleResponse)
  async getRoleById(@Args() request: RoleGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<RoleResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.roleService.getRoleById(request);
  }

  @Mutation(returns => RoleResponse)
  async updateRole(@Args() request: RoleUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<RoleResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.roleService.updateRole(request);
  }
}
