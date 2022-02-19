import {Module} from '@nestjs/common';
import {AcademicDegreeMapper} from './mapper/academic-degree.mapper';
import {AcademicDegreeService} from './service/academic-degree.service';
import {AcademicDegreeResolver} from './resolvers/academic-degree.resolver';
import {UserModule} from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [AcademicDegreeMapper, AcademicDegreeService, AcademicDegreeResolver],
  exports: [AcademicDegreeService]
})
export class AcademicDegreeModule {

}
