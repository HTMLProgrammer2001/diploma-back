import {Module} from '@nestjs/common';
import {TeacherMapper} from './mapper/teacher.mapper';
import {TeacherService} from './service/teacher.service';
import {TeacherResolver} from './resolvers/teacher.resolver';
import {registerEnumType} from '@nestjs/graphql';
import {TeacherOrderFieldsEnum} from '../../data-layer/repositories/teacher/enums/teacher-order-fields.enum';
import {TeacherCascadeDeletedByEnum} from '../../data-layer/db-models/teacher.db-model';

@Module({
  providers: [TeacherMapper, TeacherService, TeacherResolver],
  exports: [TeacherService]
})
export class TeacherModule {
  constructor() {
    registerEnumType(TeacherOrderFieldsEnum, {name: TeacherOrderFieldsEnum.name});
    registerEnumType(TeacherCascadeDeletedByEnum, {name: TeacherCascadeDeletedByEnum.name});
  }
}
