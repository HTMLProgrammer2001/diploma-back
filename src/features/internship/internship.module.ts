import {Module} from '@nestjs/common';
import {InternshipMapper} from './mapper/internship.mapper';
import {InternshipService} from './service/internship.service';
import {InternshipResolver} from './resolvers/internship.resolver';
import {registerEnumType} from '@nestjs/graphql';
import {InternshipCascadeDeletedByEnum} from '../../data-layer/db-models/internship.db-model';
import {InternshipOrderFieldsEnum} from '../../data-layer/repositories/internship/enums/internship-order-fields.enum';

@Module({
  providers: [InternshipMapper, InternshipService, InternshipResolver],
  exports: [InternshipService]
})
export class InternshipModule {
  constructor() {
    registerEnumType(InternshipCascadeDeletedByEnum, {name: InternshipCascadeDeletedByEnum.name});
    registerEnumType(InternshipOrderFieldsEnum, {name: InternshipOrderFieldsEnum.name});
  }
}
