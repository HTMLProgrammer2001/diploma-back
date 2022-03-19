import {Args, ID, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
import {AcademicTitleService} from '../service/academic-title.service';
import {AcademicTitleGetListRequest} from '../types/request/academic-title-get-list.request';
import {AcademicTitleResponse} from '../types/response/academic-title.response';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {AcademicTitleListResponse} from '../types/response/academic-title-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {AcademicTitleGetByIdRequest} from '../types/request/academic-title-get-by-id.request';
import {AcademicTitleCreateRequest} from '../types/request/academic-title-create.request';
import {AcademicTitleUpdateRequest} from '../types/request/academic-title-update.request';
import {IdResponse} from '../../../global/types/response/id.response';
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles, writeRoles} from '../../../global/utils/roles';

@Resolver(of => AcademicTitleResponse)
export class AcademicTitleResolver {
  constructor(private academicTitleService: AcademicTitleService) {
  }

  @Query(returns => AcademicTitleListResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getAcademicTitleList(@Args('query') request: AcademicTitleGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<AcademicTitleResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.academicTitleService.getAcademicTitleList(request);
  }

  @Query(returns => AcademicTitleResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getAcademicTitleById(@Args('query') request: AcademicTitleGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<AcademicTitleResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.academicTitleService.getAcademicTitleById(request);
  }

  @Mutation(returns => AcademicTitleResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async createAcademicTitle(@Args('body') request: AcademicTitleCreateRequest, @Info() info: GraphQLResolveInfo):
    Promise<AcademicTitleResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.academicTitleService.createAcademicTitle(request);
  }

  @Mutation(returns => AcademicTitleResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async updateAcademicTitle(@Args('body') request: AcademicTitleUpdateRequest, @Info() info: GraphQLResolveInfo):
    Promise<AcademicTitleResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.academicTitleService.updateAcademicTitle(request);
  }

  @Mutation(returns => IdResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  async deleteAcademicTitle(
    @Args('id', {type: () => ID}) id: number,
    @Args('guid', {type: () => String}) guid: string,
  ): Promise<IdResponse> {
    return this.academicTitleService.deleteAcademicTitle(id, guid);
  }
}
