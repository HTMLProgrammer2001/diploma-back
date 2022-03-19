import {Args, ID, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
import {AcademicDegreeService} from '../service/academic-degree.service';
import {AcademicDegreeGetListRequest} from '../types/request/academic-degree-get-list.request';
import {AcademicDegreeResponse} from '../types/response/academic-degree.response';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {AcademicDegreeListResponse} from '../types/response/academic-degree-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {AcademicDegreeGetByIdRequest} from '../types/request/academic-degree-get-by-id.request';
import {CommissionResponse} from '../../commission/types/response/commission.response';
import {AcademicDegreeCreateRequest} from '../types/request/academic-degree-create.request';
import {AcademicDegreeUpdateRequest} from '../types/request/academic-degree-update.request';
import {IdResponse} from '../../../global/types/response/id.response';
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles, writeRoles} from '../../../global/utils/roles';

@Resolver(of => AcademicDegreeResponse)
export class AcademicDegreeResolver {
  constructor(private academicDegreeService: AcademicDegreeService) {
  }

  @Query(returns => AcademicDegreeListResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getAcademicDegreeList(@Args('query') request: AcademicDegreeGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<AcademicDegreeResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.academicDegreeService.getAcademicDegreeList(request);
  }

  @Query(returns => AcademicDegreeResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getAcademicDegreeById(@Args('query') request: AcademicDegreeGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<AcademicDegreeResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.academicDegreeService.getAcademicDegreeById(request);
  }

  @Mutation(returns => AcademicDegreeResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async createAcademicDegree(@Args('body') request: AcademicDegreeCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<CommissionResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.academicDegreeService.createAcademicDegree(request);
  }

  @Mutation(returns => AcademicDegreeResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async updateAcademicDegree(@Args('body') request: AcademicDegreeUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<AcademicDegreeResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.academicDegreeService.updateAcademicDegree(request);
  }

  @Mutation(returns => IdResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async deleteAcademicDegree(
    @Args('id', {type: () => ID}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.academicDegreeService.deleteAcademicDegree(id, guid);
  }
}
