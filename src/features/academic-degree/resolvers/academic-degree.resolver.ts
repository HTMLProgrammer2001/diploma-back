import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {AcademicDegreeService} from '../service/academic-degree.service';
import {AcademicDegreeGetListRequest} from '../types/request/academic-degree-get-list.request';
import {AcademicDegreeResponse} from '../types/response/academic-degree.response';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {AcademicDegreeListResponse} from '../types/response/academic-degree-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {AcademicDegreeGetByIdRequest} from '../types/request/academic-degree-get-by-id.request';

@Resolver(of => AcademicDegreeResponse)
export class AcademicDegreeResolver {
  constructor(private academicDegreeService: AcademicDegreeService) {}

  @Query(returns => AcademicDegreeListResponse)
  async getAcademicDegreeList(@Args() request: AcademicDegreeGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<AcademicDegreeResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.academicDegreeService.getAcademicDegreeList(request);
  }

  @Query(returns => AcademicDegreeResponse)
  async getAcademicDegreeById(@Args() request: AcademicDegreeGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<AcademicDegreeResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.academicDegreeService.getAcademicDegreeById(request);
  }
}
