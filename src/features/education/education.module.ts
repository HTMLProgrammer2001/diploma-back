import {Module} from '@nestjs/common';
import {EducationMapper} from './mapper/education.mapper';
import {EducationService} from './service/education.service';
import {EducationResolver} from './resolvers/education.resolver';

@Module({
  providers: [EducationMapper, EducationService, EducationResolver],
  exports: [EducationService]
})
export class EducationModule {

}
