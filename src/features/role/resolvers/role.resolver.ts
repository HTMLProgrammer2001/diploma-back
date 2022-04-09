import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {RoleService} from '../service/role.service';
import {RoleGetListRequest} from '../types/request/role-get-list.request';
import {RoleResponse} from '../types/response/role.response';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {RoleListResponse} from '../types/response/role-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {RoleGetByIdRequest} from '../types/request/role-get-by-id.request';
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles} from '../../../global/utils/roles';

@Resolver(of => RoleResponse)
export class RoleResolver {
  constructor(private roleService: RoleService) {
  }

  @Query(returns => RoleListResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getRoleList(@Args('query') request: RoleGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<RoleResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.roleService.getRoleList(request);
  }

  @Query(returns => RoleResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getRoleById(@Args('query') request: RoleGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<RoleResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.roleService.getRoleById(request);
  }
}
