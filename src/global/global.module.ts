import {Global, Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule} from '@nestjs/config';
import {RoleGuard} from './guards/role.guard';
import {FileServiceInterface} from './services/file-service/file-service.interface';
import {LocalFileService} from './services/file-service/local-file.service';
import {RequestContext} from './services/request-context';
import {IsAuthorisedGuard} from './guards/is-authorised-guard.service';
import {LoggerInterceptor} from './interceptors/logger.interceptor';
import {MailServiceInterface} from './services/mail-service/mail-service.interface';
import {LocalMailService} from './services/mail-service/local-mail.service';

@Global()
@Module({
  imports: [JwtModule.register({}), ConfigModule],
  providers: [{
    provide: FileServiceInterface,
    useClass: LocalFileService
  }, {
    provide: MailServiceInterface,
    useClass: LocalMailService
  }, RequestContext, IsAuthorisedGuard, RoleGuard, LoggerInterceptor],
  exports: [FileServiceInterface, MailServiceInterface, RequestContext, JwtModule.register({})]
})
export class GlobalModule {
}
