import {Module} from '@nestjs/common';
import {AuthMapper} from './mapper/auth.mapper';
import {AuthService} from './service/auth.service';
import {AuthResolver} from './resolvers/auth.resolver';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule} from '@nestjs/config';

@Module({
  providers: [AuthMapper, AuthService, AuthResolver],
  imports: [JwtModule.register({}), ConfigModule],
  exports: [AuthService]
})
export class AuthModule {

}
