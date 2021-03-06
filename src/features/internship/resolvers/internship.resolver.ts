import {Args, ID, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {IdResponse} from '../../../global/types/response/id.response';
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles, writeRoles} from '../../../global/utils/roles';
import {InternshipResponse} from '../types/response/internship.response';
import {InternshipListResponse} from '../types/response/internship-list.response';
import {InternshipGetListRequest} from '../types/request/internship-get-list.request';
import {InternshipGetByIdRequest} from '../types/request/internship-get-by-id.request';
import {InternshipCreateRequest} from '../types/request/internship-create.request';
import {InternshipUpdateRequest} from '../types/request/internship-update.request';
import {InternshipService} from '../service/internship.service';
import {InternshipGetHoursFromLastAttestationResponse} from '../types/response/internship-get-hours-from-last-attestation.response';
import {InternshipGetHoursFromLastAttestationRequest} from '../types/request/internship-get-hours-from-last-attestation.request';

@Resolver(of => InternshipResponse)
export class InternshipResolver {
  constructor(private internshipService: InternshipService) {
  }

  @Query(returns => InternshipListResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @SetMetadata(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, true)
  async getInternshipList(@Args('query') request: InternshipGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<InternshipResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.internshipService.getInternshipList(request);
  }

  @Query(returns => InternshipResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @SetMetadata(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, true)
  async getInternshipById(@Args('query') request: InternshipGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<InternshipResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.internshipService.getInternshipById(request);
  }

  @Query(returns => InternshipGetHoursFromLastAttestationResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @SetMetadata(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, true)
  async getInternshipHoursFromLastAttestation(
    @Args('query') request: InternshipGetHoursFromLastAttestationRequest,
    @Info() info: GraphQLResolveInfo
  ): Promise<InternshipGetHoursFromLastAttestationResponse> {
    return this.internshipService.getInternshipHoursFromLastAttestation(request);
  }

  @Mutation(returns => InternshipResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async createInternship(@Args('body') request: InternshipCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<InternshipResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.internshipService.createInternship(request);
  }

  @Mutation(returns => InternshipResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async updateInternship(@Args('body') request: InternshipUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<InternshipResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.internshipService.updateInternship(request);
  }

  @Mutation(returns => IdResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async deleteInternship(
    @Args('id', {type: () => ID}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.internshipService.deleteInternship(id, guid);
  }
}
