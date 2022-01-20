import {Args, Info, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CommissionService} from '../service/commission.service';
import {CommissionGetListRequest} from '../types/request/commission-get-list.request';
import {CommissionResponse} from '../types/response/commission.response';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {CommissionListResponse} from '../types/response/commission-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsList} from 'graphql-fields-list';
import {CommissionGetByIdRequest} from '../types/request/commission-get-by-id.request';
import {CommissionCreateRequest} from '../types/request/commission-create.request';
import {CommissionUpdateRequest} from '../types/request/commission-update.request';

@Resolver(of => CommissionResponse)
export class CommissionResolver {
  constructor(private commissionService: CommissionService) {}

  @Query(returns => CommissionListResponse)
  async getCommissionsList(@Args() request: CommissionGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<CommissionResponse>> {
    request.select = fieldsList(info, {path: 'responseList'});
    return this.commissionService.getCommissionList(request);
  }

  @Query(returns => CommissionResponse)
  async getCommissionById(@Args() request: CommissionGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<CommissionResponse> {
    request.select = fieldsList(info);
    return this.commissionService.getCommissionById(request);
  }

  @Mutation(returns => CommissionResponse)
  async createCommission(@Args() request: CommissionCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<CommissionResponse> {
    request.select = fieldsList(info);
    return this.commissionService.createCommission(request);
  }

  @Mutation(returns => CommissionResponse)
  async updateCommission(@Args() request: CommissionUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<CommissionResponse> {
    request.select = fieldsList(info);
    return this.commissionService.updateCommission(request);
  }

  @Mutation(returns => Int)
  async deleteCommission(@Args('id', {type: () => Int}) id: number): Promise<number> {
    return this.commissionService.deleteCommission(id);
  }
}
