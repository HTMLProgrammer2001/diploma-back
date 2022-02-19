import {Module} from '@nestjs/common';
import {UserMapper} from './mapper/user.mapper';
import {UserService} from './service/user.service';
import {UserResolver} from './resolvers/user.resolver';

@Module({
  providers: [UserMapper, UserService, UserResolver],
  exports: [UserService]
})
export class UserModule {

}
