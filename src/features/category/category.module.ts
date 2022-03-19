import {Module} from '@nestjs/common';
import {CategoryMapper} from './mapper/category.mapper';
import {CategoryService} from './service/category.service';
import {CategoryResolver} from './resolvers/category.resolver';
import {AttestationModule} from '../attestation/attestation.module';
import {registerEnumType} from '@nestjs/graphql';
import {CategoryOrderFieldsEnum} from '../../data-layer/repositories/category/enums/category-order-fields.enum';

@Module({
  imports: [AttestationModule],
  providers: [CategoryMapper, CategoryService, CategoryResolver],
  exports: [CategoryService]
})
export class CategoryModule {
  constructor() {
    registerEnumType(CategoryOrderFieldsEnum, {name: CategoryOrderFieldsEnum.name});
  }
}
