import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {AcademicTitleService} from '../service/academic-title.service';
import {AcademicTitleGetListRequest} from '../types/request/academic-title-get-list.request';
import {AcademicTitleResponse} from '../types/response/academic-title.response';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {AcademicTitleListResponse} from '../types/response/academic-title-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {AcademicTitleGetByIdRequest} from '../types/request/academic-title-get-by-id.request';

@Resolver(of => AcademicTitleResponse)
export class AcademicTitleResolver {
  constructor(private academicTitleService: AcademicTitleService) {}

  @Query(returns => AcademicTitleListResponse)
  async getAcademicTitleList(@Args() request: AcademicTitleGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<AcademicTitleResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.academicTitleService.getAcademicTitleList(request);
  }

  @Query(returns => AcademicTitleResponse)
  async getAcademicTitleById(@Args() request: AcademicTitleGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<AcademicTitleResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.academicTitleService.getAcademicTitleById(request);
  }
}
