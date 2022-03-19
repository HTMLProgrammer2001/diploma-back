import {Module} from '@nestjs/common';
import {UserMapper} from './mapper/user.mapper';
import {UserService} from './service/user.service';
import {UserResolver} from './resolvers/user.resolver';
import {ConfigModule} from '@nestjs/config';
import {registerEnumType} from '@nestjs/graphql';
import {UserOrderFieldsEnum} from '../../data-layer/repositories/user/enums/user-order-fields.enum';

@Module({
  imports: [ConfigModule],
  providers: [UserMapper, UserService, UserResolver],
  exports: [UserService]
})
export class UserModule {
  constructor() {
    registerEnumType(UserOrderFieldsEnum, {name: UserOrderFieldsEnum.name});
  }
}
