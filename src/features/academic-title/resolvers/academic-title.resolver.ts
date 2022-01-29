import {Args, Info, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {AcademicTitleService} from '../service/academic-title.service';
import {AcademicTitleGetListRequest} from '../types/request/academic-title-get-list.request';
import {AcademicTitleResponse} from '../types/response/academic-title.response';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {AcademicTitleListResponse} from '../types/response/academic-title-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsList, fieldsProjection} from 'graphql-fields-list';
import {AcademicTitleGetByIdRequest} from '../types/request/academic-title-get-by-id.request';
import {AcademicDegreeResponse} from '../../academic-degree/types/response/academic-degree.response';
import {AcademicDegreeCreateRequest} from '../../academic-degree/types/request/academic-degree-create.request';
import {CommissionResponse} from '../../commission/types/response/commission.response';
import {AcademicDegreeUpdateRequest} from '../../academic-degree/types/request/academic-degree-update.request';
import {AcademicTitleCreateRequest} from '../types/request/academic-title-create.request';
import {AcademicTitleUpdateRequest} from '../types/request/academic-title-update.request';

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

  @Mutation(returns => AcademicTitleResponse)
  async createAcademicTitle(@Args() request: AcademicTitleCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<AcademicTitleResponse> {
    request.select = fieldsList(info);
    return this.academicTitleService.createAcademicTitle(request);
  }

  @Mutation(returns => AcademicTitleResponse)
  async updateAcademicTitle(@Args() request: AcademicTitleUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<AcademicTitleResponse> {
    request.select = fieldsList(info);
    return this.academicTitleService.updateAcademicTitle(request);
  }

  @Mutation(returns => Int)
  async deleteAcademicTitle(
    @Args('id', {type: () => Int}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<number> {
    return this.academicTitleService.deleteAcademicTitle(id, guid);
  }
}
