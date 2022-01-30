import {Global, Module} from '@nestjs/common';
import {FileServiceInterface} from './services/file-service/file-service.interface';
import {LocalFileService} from './services/file-service/local-file.service';

@Global()
@Module({
  providers: [{
    provide: FileServiceInterface,
    useClass: LocalFileService
  }],
  exports: [FileServiceInterface]
})
export class GlobalModule {}
