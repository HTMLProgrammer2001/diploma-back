import {Module} from '@nestjs/common';
import {AcademicTitleMapper} from './mapper/academic-title.mapper';
import {AcademicTitleService} from './service/academic-title.service';
import {AcademicTitleResolver} from './resolvers/academic-title.resolver';

@Module({
  providers: [AcademicTitleMapper, AcademicTitleService, AcademicTitleResolver]
})
export class AcademicTitleModule {

}
