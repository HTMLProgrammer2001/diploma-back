import {Module} from '@nestjs/common';
import {ExportResolver} from './resolvers/export.resolver';
import {ExportService} from './service/export.service';
import {ExportMapper} from './mapper/export.mapper';
import {FillerFactory} from './fillers/filler-factory';
import {registerEnumType} from '@nestjs/graphql';
import {ExportSelectEnum} from './types/common/export-select.enum';

@Module({
  providers: [ExportMapper, ExportService, ExportResolver, FillerFactory],
  exports: [ExportService]
})
export class ExportModule {
  constructor() {
    registerEnumType(ExportSelectEnum, {name: 'ExportSelectEnum'});
  }
}
