import {Module} from '@nestjs/common';
import {EducationMapper} from './mapper/education.mapper';
import {EducationService} from './service/education.service';
import {EducationResolver} from './resolvers/education.resolver';
import {registerEnumType} from '@nestjs/graphql';
import {EducationOrderFieldsEnum} from '../../data-layer/repositories/education/enums/education-order-fields.enum';
import {EducationCascadeDeletedByEnum} from '../../data-layer/db-models/education.db-model';

@Module({
  providers: [EducationMapper, EducationService, EducationResolver],
  exports: [EducationService]
})
export class EducationModule {
  constructor() {
    registerEnumType(EducationOrderFieldsEnum, {name: EducationOrderFieldsEnum.name});
    registerEnumType(EducationCascadeDeletedByEnum, {name: EducationCascadeDeletedByEnum.name});
  }
}
