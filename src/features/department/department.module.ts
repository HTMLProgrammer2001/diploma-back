import {Module} from '@nestjs/common';
import {DepartmentMapper} from './mapper/department.mapper';
import {DepartmentService} from './service/department.service';
import {DepartmentResolver} from './resolvers/department.resolver';
import {registerEnumType} from '@nestjs/graphql';
import {DepartmentOrderFieldsEnum} from '../../data-layer/repositories/department/enums/department-order-fields.enum';

@Module({
  providers: [DepartmentMapper, DepartmentService, DepartmentResolver],
  exports: [DepartmentService]
})
export class DepartmentModule {
  constructor() {
    registerEnumType(DepartmentOrderFieldsEnum, {name: DepartmentOrderFieldsEnum.name});
  }
}
