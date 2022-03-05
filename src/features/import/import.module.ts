import {Module} from '@nestjs/common';
import {ImportMapper} from './mapper/import.mapper';
import {ImportResolver} from './resolvers/import.resolver';
import {ImportService} from './services/import.service';
import {registerEnumType} from '@nestjs/graphql';
import {ImportDataTypeEnum} from './types/common/import-data-type.enum';
import {GenerateImportTemplateService} from './services/generate-import-template.service';

@Module({
  providers: [ImportMapper, ImportResolver, ImportService, GenerateImportTemplateService]
})
export class ImportModule {
  constructor() {
    registerEnumType(ImportDataTypeEnum, {name: 'ImportTypeEnum'})
  }
}
