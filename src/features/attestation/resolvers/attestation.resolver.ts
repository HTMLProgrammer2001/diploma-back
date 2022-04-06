import {Args, ID, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {IdResponse} from '../../../global/types/response/id.response';
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles, writeRoles} from '../../../global/utils/roles';
import {AttestationResponse} from '../types/response/attestation.response';
import {AttestationListResponse} from '../types/response/attestation-list.response';
import {AttestationGetListRequest} from '../types/request/attestation-get-list.request';
import {AttestationGetByIdRequest} from '../types/request/attestation-get-by-id.request';
import {AttestationCreateRequest} from '../types/request/attestation-create.request';
import {AttestationUpdateRequest} from '../types/request/attestation-update.request';
import {AttestationService} from '../service/attestation.service';
import {AttestationGetLastDateRequest} from '../types/request/attestation-get-last-date.request';
import {AttestationGetLastDateResponse} from '../types/response/attestation-get-last-date.response';

@Resolver(of => AttestationResponse)
export class AttestationResolver {
  constructor(private attestationService: AttestationService) {
  }

  @Query(returns => AttestationListResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @SetMetadata(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, true)
  async getAttestationList(@Args('query') request: AttestationGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<AttestationResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.attestationService.getAttestationList(request);
  }

  @Query(returns => AttestationResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @SetMetadata(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, true)
  async getAttestationById(@Args('query') request: AttestationGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<AttestationResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.attestationService.getAttestationById(request);
  }

  @Mutation(returns => AttestationResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async createAttestation(@Args('body') request: AttestationCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<AttestationResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.attestationService.createAttestation(request);
  }

  @Mutation(returns => AttestationResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async updateAttestation(@Args('body') request: AttestationUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<AttestationResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.attestationService.updateAttestation(request);
  }

  @Mutation(returns => IdResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async deleteAttestation(
    @Args('id', {type: () => ID}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.attestationService.deleteAttestation(id, guid);
  }

  @Query(returns => AttestationGetLastDateResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getLastAttestationDate(@Args('query') body: AttestationGetLastDateRequest): Promise<AttestationGetLastDateResponse> {
    return this.attestationService.getLastDate(body);
  }
}
