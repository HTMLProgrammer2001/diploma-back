import {Global, Module} from '@nestjs/common';
import {FileServiceInterface} from './services/file-service/file-service.interface';
import {LocalFileService} from './services/file-service/local-file.service';
import {RequestContext} from './services/request-context';

@Global()
@Module({
  providers: [{
    provide: FileServiceInterface,
    useClass: LocalFileService
  }, RequestContext],
  exports: [FileServiceInterface, RequestContext]
})
export class GlobalModule {}
