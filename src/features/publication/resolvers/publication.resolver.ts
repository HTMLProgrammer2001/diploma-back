import {Args, Info, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles, writeRoles} from '../../../global/utils/roles';
import {PublicationResponse} from '../types/response/publication.response';
import {PublicationListResponse} from '../types/response/publication-list.response';
import {PublicationGetListRequest} from '../types/request/publication-get-list.request';
import {PublicationGetByIdRequest} from '../types/request/publication-get-by-id.request';
import {PublicationUpdateRequest} from '../types/request/publication-update.request';
import {IdResponse} from '../../../global/types/response/id.response';
import {PublicationService} from '../service/publication.service';
import {PublicationCreateRequest} from '../types/request/publication-create.request';

@Resolver(of => PublicationResponse)
export class PublicationResolver {
  constructor(private publicationService: PublicationService) {
  }

  @Query(returns => PublicationListResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @SetMetadata(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, true)
  async getPublicationList(@Args('query') request: PublicationGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<PublicationResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.publicationService.getPublicationList(request);
  }

  @Query(returns => PublicationResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @SetMetadata(MetaDataFieldEnum.IS_TEACHER_HAS_ACCESS, true)
  async getPublicationById(@Args('query') request: PublicationGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<PublicationResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.publicationService.getPublicationById(request);
  }

  @Mutation(returns => PublicationResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async createPublication(@Args('body') request: PublicationCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<PublicationResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.publicationService.createPublication(request);
  }

  @Mutation(returns => PublicationResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async updatePublication(@Args('body') request: PublicationUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<PublicationResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.publicationService.updatePublication(request);
  }

  @Mutation(returns => IdResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async deletePublication(
    @Args('id', {type: () => Int}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.publicationService.deletePublication(id, guid);
  }
}
