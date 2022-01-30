import {Args, Info, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {TeachingRankService} from '../service/teaching-rank.service';
import {TeachingRankGetListRequest} from '../types/request/teaching-rank-get-list.request';
import {TeachingRankResponse} from '../types/response/teaching-rank.response';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {TeachingRankListResponse} from '../types/response/teaching-rank-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {TeachingRankGetByIdRequest} from '../types/request/teaching-rank-get-by-id.request';
import {TeachingRankCreateRequest} from '../types/request/teaching-rank-create.request';
import {TeachingRankUpdateRequest} from '../types/request/teaching-rank-update.request';
import {IdResponse} from '../../../global/types/response/id.response';

@Resolver(of => TeachingRankResponse)
export class TeachingRankResolver {
  constructor(private teachingRankService: TeachingRankService) {}

  @Query(returns => TeachingRankListResponse)
  async getTeachingRankList(@Args('query') request: TeachingRankGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<TeachingRankResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.teachingRankService.getTeachingRankList(request);
  }

  @Query(returns => TeachingRankResponse)
  async getTeachingRankById(@Args('query') request: TeachingRankGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<TeachingRankResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.teachingRankService.getTeachingRankById(request);
  }

  @Mutation(returns => TeachingRankResponse)
  async createTeachingRank(@Args('body') request: TeachingRankCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<TeachingRankResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.teachingRankService.createTeachingRank(request);
  }

  @Mutation(returns => TeachingRankResponse)
  async updateTeachingRank(@Args('body') request: TeachingRankUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<TeachingRankResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.teachingRankService.updateTeachingRank(request);
  }

  @Mutation(returns => IdResponse)
  async deleteTeachingRank(
    @Args('id', {type: () => Int}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.teachingRankService.deleteTeachingRank(id, guid);
  }
}
