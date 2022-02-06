import {Args, Info, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {CommissionService} from '../service/commission.service';
import {CommissionGetListRequest} from '../types/request/commission-get-list.request';
import {CommissionResponse} from '../types/response/commission.response';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {CommissionGetByIdRequest} from '../types/request/commission-get-by-id.request';
import {CommissionCreateRequest} from '../types/request/commission-create.request';
import {CommissionUpdateRequest} from '../types/request/commission-update.request';
import {CommissionListResponse} from '../types/response/commission-list.response';
import {IdResponse} from '../../../global/types/response/id.response';
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles, writeRoles} from '../../../global/utils/roles';

@Resolver(of => CommissionResponse)
export class CommissionResolver {
  constructor(private commissionService: CommissionService) {
  }

  @Query(returns => CommissionListResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getCommissionsList(@Args('query') request: CommissionGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<CommissionResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.commissionService.getCommissionList(request);
  }

  @Query(returns => CommissionResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getCommissionById(@Args('query') request: CommissionGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<CommissionResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.commissionService.getCommissionById(request);
  }

  @Mutation(returns => CommissionResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async createCommission(@Args('body') request: CommissionCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<CommissionResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.commissionService.createCommission(request);
  }

  @Mutation(returns => CommissionResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async updateCommission(@Args('body') request: CommissionUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<CommissionResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.commissionService.updateCommission(request);
  }

  @Mutation(returns => IdResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async deleteCommission(
    @Args('id', {type: () => Int}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.commissionService.deleteCommission(id, guid);
  }
}
