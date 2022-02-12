import {Args, Info, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {CommissionResponse} from '../../commission/types/response/commission.response';
import {IdResponse} from '../../../global/types/response/id.response';
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles, writeRoles} from '../../../global/utils/roles';
import {EducationQualificationResponse} from '../types/response/education-qualification.response';
import {EducationQualificationGetListRequest} from '../types/request/education-qualification-get-list.request';
import {EducationQualificationListResponse} from '../types/response/education-qualification-list.response';
import {EducationQualificationGetByIdRequest} from '../types/request/education-qualification-get-by-id.request';
import {EducationQualificationCreateRequest} from '../types/request/education-qualification-create.request';
import {EducationQualificationUpdateRequest} from '../types/request/education-qualification-update.request';
import {EducationQualificationService} from '../service/education-qualification.service';

@Resolver(of => EducationQualificationResponse)
export class EducationQualificationResolver {
  constructor(private academicDegreeService: EducationQualificationService) {
  }

  @Query(returns => EducationQualificationListResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getEducationQualificationList(@Args('query') request: EducationQualificationGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<EducationQualificationResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.academicDegreeService.getEducationQualificationList(request);
  }

  @Query(returns => EducationQualificationResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getEducationQualificationById(@Args('query') request: EducationQualificationGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<EducationQualificationResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.academicDegreeService.getEducationQualificationById(request);
  }

  @Mutation(returns => EducationQualificationResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async createEducationQualification(@Args('body') request: EducationQualificationCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<CommissionResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.academicDegreeService.createEducationQualification(request);
  }

  @Mutation(returns => EducationQualificationResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async updateEducationQualification(@Args('body') request: EducationQualificationUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<EducationQualificationResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.academicDegreeService.updateEducationQualification(request);
  }

  @Mutation(returns => IdResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async deleteEducationQualification(
    @Args('id', {type: () => Int}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.academicDegreeService.deleteEducationQualification(id, guid);
  }
}
