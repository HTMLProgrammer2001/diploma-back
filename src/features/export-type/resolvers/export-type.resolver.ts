import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {ExportTypeService} from '../service/export-type.service';
import {ExportTypeGetListRequest} from '../types/request/export-type-get-list.request';
import {ExportTypeResponse} from '../types/response/export-type.response';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {ExportTypeListResponse} from '../types/response/export-type-list.response';
import {GraphQLResolveInfo} from 'graphql';
import {fieldsProjection} from 'graphql-fields-list';
import {ExportTypeGetByIdRequest} from '../types/request/export-type-get-by-id.request';
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles} from '../../../global/utils/roles';

@Resolver(of => ExportTypeResponse)
export class ExportTypeResolver {
  constructor(private exportTypeService: ExportTypeService) {
  }

  @Query(returns => ExportTypeListResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getExportTypeList(@Args('query') request: ExportTypeGetListRequest, @Info() info: GraphQLResolveInfo):
    Promise<IPaginator<ExportTypeResponse>> {
    request.select = Object.keys(fieldsProjection(info, {path: 'responseList'}));
    return this.exportTypeService.getExportTypeList(request);
  }

  @Query(returns => ExportTypeResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async getExportTypeById(@Args('query') request: ExportTypeGetByIdRequest, @Info() info: GraphQLResolveInfo):
    Promise<ExportTypeResponse> {
    request.select = Object.keys(fieldsProjection(info));
    return this.exportTypeService.getExportTypeById(request);
  }
}
