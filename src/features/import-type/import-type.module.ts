import {Module} from '@nestjs/common';
import {ImportTypeMapper} from './mapper/import-type.mapper';
import {ImportTypeService} from './service/import-type.service';
import {ImportTypeResolver} from './resolvers/import-type.resolver';
import {registerEnumType} from '@nestjs/graphql';
import {ImportTypeOrderFieldsEnum} from '../../data-layer/repositories/import-type/enums/import-type-order-fields.enum';

@Module({
  providers: [ImportTypeMapper, ImportTypeService, ImportTypeResolver],
  exports: [ImportTypeService]
})
export class ImportTypeModule {
  constructor() {
    registerEnumType(ImportTypeOrderFieldsEnum, {name: ImportTypeOrderFieldsEnum.name});
  }
}
