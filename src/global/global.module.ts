import {Global, Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {RoleGuard} from './guards/role.guard';
import {FileServiceInterface} from './services/file-service/file-service.interface';
import {LocalFileService} from './services/file-service/local-file.service';
import {RequestContext} from './services/request-context';
import {IsAuthorisedGuard} from './guards/is-authorised-guard.service';
import {LoggerInterceptor} from './interceptors/logger.interceptor';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [{
    provide: FileServiceInterface,
    useClass: LocalFileService
  }, RequestContext, IsAuthorisedGuard, RoleGuard, LoggerInterceptor],
  exports: [FileServiceInterface, RequestContext, JwtModule.register({})]
})
export class GlobalModule {
}
