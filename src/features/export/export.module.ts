import {Module} from '@nestjs/common';
import {ExportResolver} from './resolvers/export.resolver';
import {ExportService} from './service/export.service';
import {ExportMapper} from './mapper/export.mapper';
import {FillerFactory} from './fillers/filler-factory';

@Module({
  providers: [ExportMapper, ExportService, ExportResolver, FillerFactory],
  exports: [ExportService]
})
export class ExportModule {

}
