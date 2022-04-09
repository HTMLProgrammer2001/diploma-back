import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {ImportTypeService} from '../service/import-type.service';
import {ImportTypeGetListRequest} from '../types/request/import-type-get-list.request';
import {ImportTypeResponse} from '../types/response/import-type.response';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {ImportTypeListResponse} from '../types/response/import-type-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {ImportTypeGetByIdRequest} from '../types/request/import-type-get-by-id.request';
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles} from '../../../global/utils/roles';

@Resolver(of => ImportTypeResponse)
export class ImportTypeResolver {
  constructor(private importTypeService: ImportTypeService) {
  }

  @Query(returns => ImportTypeListResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getImportTypeList(@Args('query') request: ImportTypeGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<ImportTypeResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.importTypeService.getImportTypeList(request);
  }

  @Query(returns => ImportTypeResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getImportTypeById(@Args('query') request: ImportTypeGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<ImportTypeResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.importTypeService.getImportTypeById(request);
  }
}
