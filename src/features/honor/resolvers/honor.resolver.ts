import {Args, ID, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
import {HonorService} from '../service/honor.service';
import {HonorGetListRequest} from '../types/request/honor-get-list.request';
import {HonorResponse} from '../types/response/honor.response';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {HonorListResponse} from '../types/response/honor-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {HonorGetByIdRequest} from '../types/request/honor-get-by-id.request';
import {HonorCreateRequest} from '../types/request/honor-create.request';
import {IdResponse} from '../../../global/types/response/id.response';
import {HonorUpdateRequest} from '../types/request/honor-update.request';
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles, writeRoles} from '../../../global/utils/roles';

@Resolver(of => HonorResponse)
export class HonorResolver {
  constructor(private honorService: HonorService) {
  }

  @Query(returns => HonorListResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @SetMetadata(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, true)
  async getHonorList(@Args('query') request: HonorGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<HonorResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.honorService.getHonorList(request);
  }

  @Query(returns => HonorResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @SetMetadata(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, true)
  async getHonorById(@Args('query') request: HonorGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<HonorResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.honorService.getHonorById(request);
  }

  @Mutation(returns => HonorResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async createHonor(@Args('body') request: HonorCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<HonorResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.honorService.createHonor(request);
  }

  @Mutation(returns => HonorResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async updateHonor(@Args('body') request: HonorUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<HonorResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.honorService.updateHonor(request);
  }

  @Mutation(returns => IdResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async deleteHonor(
    @Args('id', {type: () => ID}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.honorService.deleteHonor(id, guid);
  }
}
