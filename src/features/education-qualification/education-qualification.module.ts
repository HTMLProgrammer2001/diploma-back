import {Module} from '@nestjs/common';
import {EducationQualificationMapper} from './mapper/education-qualification.mapper';
import {EducationQualificationService} from './service/education-qualification.service';
import {EducationQualificationResolver} from './resolvers/education-qualification.resolver';
import {registerEnumType} from '@nestjs/graphql';
import {EducationQualificationOrderFieldsEnum} from '../../data-layer/repositories/education-qualification/enums/education-qualification-order-fields.enum';

@Module({
  providers: [EducationQualificationMapper, EducationQualificationService, EducationQualificationResolver],
  exports: [EducationQualificationService]
})
export class EducationQualificationModule {
  constructor() {
    registerEnumType(EducationQualificationOrderFieldsEnum, {name: EducationQualificationOrderFieldsEnum.name});
  }
}
