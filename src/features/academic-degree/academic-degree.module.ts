import {Module} from '@nestjs/common';
import {AcademicDegreeMapper} from './mapper/academic-degree.mapper';
import {AcademicDegreeService} from './service/academic-degree.service';
import {AcademicDegreeResolver} from './resolvers/academic-degree.resolver';
import {UserModule} from '../user/user.module';
import {registerEnumType} from '@nestjs/graphql';
import {AcademicDegreeOrderFieldsEnum} from '../../data-layer/repositories/academic-degree/enums/academic-degree-order-fields.enum';

@Module({
  imports: [UserModule],
  providers: [AcademicDegreeMapper, AcademicDegreeService, AcademicDegreeResolver],
  exports: [AcademicDegreeService]
})
export class AcademicDegreeModule {
  constructor() {
    registerEnumType(AcademicDegreeOrderFieldsEnum, {name: AcademicDegreeOrderFieldsEnum.name});
  }
}
