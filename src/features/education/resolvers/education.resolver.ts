import {Args, Info, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {IdResponse} from '../../../global/types/response/id.response';
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles, writeRoles} from '../../../global/utils/roles';
import {EducationResponse} from '../types/response/education.response';
import {EducationService} from '../service/education.service';
import {EducationListResponse} from '../types/response/education-list.response';
import {EducationGetListRequest} from '../types/request/education-get-list.request';
import {EducationGetByIdRequest} from '../types/request/education-get-by-id.request';
import {EducationCreateRequest} from '../types/request/education-create.request';
import {EducationUpdateRequest} from '../types/request/education-update.request';

@Resolver(of => EducationResponse)
export class EducationResolver {
  constructor(private educationService: EducationService) {
  }

  @Query(returns => EducationListResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @SetMetadata(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, true)
  async getEducationList(@Args('query') request: EducationGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<EducationResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.educationService.getEducationList(request);
  }

  @Query(returns => EducationResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @SetMetadata(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, true)
  async getEducationById(@Args('query') request: EducationGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<EducationResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.educationService.getEducationById(request);
  }

  @Mutation(returns => EducationResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async createEducation(@Args('body') request: EducationCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<EducationResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.educationService.createEducation(request);
  }

  @Mutation(returns => EducationResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async updateEducation(@Args('body') request: EducationUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<EducationResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.educationService.updateEducation(request);
  }

  @Mutation(returns => IdResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async deleteEducation(
    @Args('id', {type: () => Int}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.educationService.deleteEducation(id, guid);
  }
}
