import {Module} from '@nestjs/common';
import {ExportResolver} from './resolvers/export.resolver';
import {ExportService} from './service/export.service';
import {ExportMapper} from './mapper/export.mapper';

@Module({
  providers: [ExportMapper, ExportService, ExportResolver],
  exports: [ExportService]
})
export class ExportModule {

}
