import {Module} from '@nestjs/common';
import {AcademicTitleMapper} from './mapper/academic-title.mapper';
import {AcademicTitleService} from './service/academic-title.service';
import {AcademicTitleResolver} from './resolvers/academic-title.resolver';
import {registerEnumType} from '@nestjs/graphql';
import {AcademicTitleOrderFieldsEnum} from '../../data-layer/repositories/academic-title/enums/academic-title-order-fields.enum';

@Module({
  providers: [AcademicTitleMapper, AcademicTitleService, AcademicTitleResolver],
  exports: [AcademicTitleService]
})
export class AcademicTitleModule {
  constructor() {
    registerEnumType(AcademicTitleOrderFieldsEnum, {name: AcademicTitleOrderFieldsEnum.name});
  }
}
