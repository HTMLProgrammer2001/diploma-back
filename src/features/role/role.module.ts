import {Module} from '@nestjs/common';
import {RoleMapper} from './mapper/role.mapper';
import {RoleService} from './service/role.service';
import {RoleResolver} from './resolvers/role.resolver';

@Module({
  providers: [RoleMapper, RoleService, RoleResolver],
  exports: [RoleService]
})
export class RoleModule {

}
