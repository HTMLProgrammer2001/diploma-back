import {Module} from '@nestjs/common';
import {RoleMapper} from './mapper/role.mapper';
import {RoleService} from './service/role.service';
import {RoleResolver} from './resolvers/role.resolver';
import {registerEnumType} from '@nestjs/graphql';
import {RoleOrderFieldsEnum} from '../../data-layer/repositories/role/enums/role-order-fields.enum';

@Module({
  providers: [RoleMapper, RoleService, RoleResolver],
  exports: [RoleService]
})
export class RoleModule {
  constructor() {
    registerEnumType(RoleOrderFieldsEnum, {name: RoleOrderFieldsEnum.name});
  }
}
