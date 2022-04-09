import {Module} from '@nestjs/common';
import {ExportTypeMapper} from './mapper/export-type.mapper';
import {ExportTypeService} from './service/export-type.service';
import {ExportTypeResolver} from './resolvers/export-type.resolver';
import {registerEnumType} from '@nestjs/graphql';
import {ExportTypeOrderFieldsEnum} from '../../data-layer/repositories/export-type/enums/export-type-order-fields.enum';

@Module({
  providers: [ExportTypeMapper, ExportTypeService, ExportTypeResolver],
  exports: [ExportTypeService]
})
export class ExportTypeModule {
  constructor() {
    registerEnumType(ExportTypeOrderFieldsEnum, {name: ExportTypeOrderFieldsEnum.name});
  }
}
