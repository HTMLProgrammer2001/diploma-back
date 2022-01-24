import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {TeachingRankService} from '../service/teaching-rank.service';
import {TeachingRankGetListRequest} from '../types/request/teaching-rank-get-list.request';
import {TeachingRankResponse} from '../types/response/teaching-rank.response';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {TeachingRankListResponse} from '../types/response/teaching-rank-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {TeachingRankGetByIdRequest} from '../types/request/teaching-rank-get-by-id.request';

@Resolver(of => TeachingRankResponse)
export class TeachingRankResolver {
  constructor(private teachingRankService: TeachingRankService) {}

  @Query(returns => TeachingRankListResponse)
  async getTeachingRankList(@Args() request: TeachingRankGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<TeachingRankResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.teachingRankService.getTeachingRankList(request);
  }

  @Query(returns => TeachingRankResponse)
  async getTeachingRankById(@Args() request: TeachingRankGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<TeachingRankResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.teachingRankService.getTeachingRankById(request);
  }
}
