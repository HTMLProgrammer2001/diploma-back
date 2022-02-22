import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {SetMetadata} from '@nestjs/common';
import {ExportRequest} from '../types/request/export.request';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {readRoles} from '../../../global/utils/roles';
import {ExportService} from '../service/export.service';
import {ExportResponse} from '../types/response/export.response';

@Resolver()
export class ExportResolver {
  constructor(private exportService: ExportService) {
  }

  @Mutation(returns => ExportResponse)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  async generateReport(@Args('body') request: ExportRequest): Promise<ExportResponse> {
    return this.exportService.generateReport(request);
  }
}
