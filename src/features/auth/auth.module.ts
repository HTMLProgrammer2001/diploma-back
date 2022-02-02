import {Module} from '@nestjs/common';
import {AuthMapper} from './mapper/auth.mapper';
import {AuthService} from './service/auth.service';
import {AuthResolver} from './resolvers/auth.resolver';

@Module({
  providers: [AuthMapper, AuthService, AuthResolver]
})
export class AuthModule {

}
