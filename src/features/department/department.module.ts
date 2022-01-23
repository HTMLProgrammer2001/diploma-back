import {Module} from '@nestjs/common';
import {DepartmentMapper} from './mapper/department.mapper';
import {DepartmentService} from './service/department.service';
import {DepartmentResolver} from './resolvers/department.resolver';

@Module({
  providers: [DepartmentMapper, DepartmentService, DepartmentResolver]
})
export class DepartmentModule {

}
