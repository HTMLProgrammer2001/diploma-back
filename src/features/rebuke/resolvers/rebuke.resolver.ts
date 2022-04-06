import {Args, ID, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {IdResponse} from '../../../global/types/response/id.response';
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles, writeRoles} from '../../../global/utils/roles';
import {RebukeResponse} from '../types/response/rebuke.response';
import {RebukeListResponse} from '../types/response/rebuke-list.response';
import {RebukeGetListRequest} from '../types/request/rebuke-get-list.request';
import {RebukeGetByIdRequest} from '../types/request/rebuke-get-by-id.request';
import {RebukeCreateRequest} from '../types/request/rebuke-create.request';
import {RebukeUpdateRequest} from '../types/request/rebuke-update.request';
import {RebukeService} from '../service/rebuke.service';

@Resolver(of => RebukeResponse)
export class RebukeResolver {
  constructor(private rebukeService: RebukeService) {
  }

  @Query(returns => RebukeListResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @SetMetadata(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, true)
  async getRebukeList(@Args('query') request: RebukeGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<RebukeResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.rebukeService.getRebukeList(request);
  }

  @Query(returns => RebukeResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @SetMetadata(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, true)
  async getRebukeById(@Args('query') request: RebukeGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<RebukeResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.rebukeService.getRebukeById(request);
  }

  @Mutation(returns => RebukeResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async createRebuke(@Args('body') request: RebukeCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<RebukeResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.rebukeService.createRebuke(request);
  }

  @Mutation(returns => RebukeResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async updateRebuke(@Args('body') request: RebukeUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<RebukeResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.rebukeService.updateRebuke(request);
  }

  @Mutation(returns => IdResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async deleteRebuke(
    @Args('id', {type: () => ID}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.rebukeService.deleteRebuke(id, guid);
  }
}
