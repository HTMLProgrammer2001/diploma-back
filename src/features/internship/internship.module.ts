import {Module} from '@nestjs/common';
import {InternshipMapper} from './mapper/internship.mapper';
import {InternshipService} from './service/internship.service';
import {InternshipResolver} from './resolvers/internship.resolver';

@Module({
  providers: [InternshipMapper, InternshipService, InternshipResolver],
  exports: [InternshipService]
})
export class InternshipModule {

}
