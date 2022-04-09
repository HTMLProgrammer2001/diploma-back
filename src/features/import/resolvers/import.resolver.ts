import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {SetMetadata} from '@nestjs/common';
import {GenerateImportTemplateResponse} from '../types/response/generate-import-template.response';
import {GenerateImportTemplateRequest} from '../types/request/generate-import-template.request';
import {ImportService} from '../services/import.service';
import {GenerateImportTemplateService} from '../services/generate-import-template.service';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {writeRoles} from '../../../global/utils/roles';
import {ImportRequest} from '../types/request/import.request';
import {ImportResponse} from '../types/response/import.response';

@Resolver()
export class ImportResolver {
  constructor(
    private importService: ImportService,
    private generateImportTemplateService: GenerateImportTemplateService,
  ) {}

  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  @Mutation(returns => GenerateImportTemplateResponse)
  async generateImportTemplate(@Args('body') body: GenerateImportTemplateRequest):
    Promise<GenerateImportTemplateResponse> {
    return this.generateImportTemplateService.generateImportTemplate(body);
  }

  @SetMetadata(MetaDataFieldEnum.ROLES, writeRoles)
  @Mutation(returns => ImportResponse)
  async importData(@Args('body') body: ImportRequest): Promise<ImportResponse> {
    return this.importService.importData(body);
  }
}
