import {Module} from '@nestjs/common';
import {ImportTypeMapper} from './mapper/import-type.mapper';
import {ImportTypeService} from './service/import-type.service';
import {ImportTypeResolver} from './resolvers/import-type.resolver';

@Module({
  providers: [ImportTypeMapper, ImportTypeService, ImportTypeResolver],
  exports: [ImportTypeService]
})
export class ImportTypeModule {

}
