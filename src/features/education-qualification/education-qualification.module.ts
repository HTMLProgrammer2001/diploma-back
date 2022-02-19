import {Module} from '@nestjs/common';
import {EducationQualificationMapper} from './mapper/education-qualification.mapper';
import {EducationQualificationService} from './service/education-qualification.service';
import {EducationQualificationResolver} from './resolvers/education-qualification.resolver';

@Module({
  providers: [EducationQualificationMapper, EducationQualificationService, EducationQualificationResolver],
  exports: [EducationQualificationService]
})
export class EducationQualificationModule {

}
