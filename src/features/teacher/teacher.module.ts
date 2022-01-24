import {Module} from '@nestjs/common';
import {TeacherMapper} from './mapper/teacher.mapper';
import {TeacherService} from './service/teacher.service';
import {TeacherResolver} from './resolvers/teacher.resolver';

@Module({
  providers: [TeacherMapper, TeacherService, TeacherResolver]
})
export class TeacherModule {

}
