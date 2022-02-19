import {Module} from '@nestjs/common';
import {CategoryMapper} from './mapper/category.mapper';
import {CategoryService} from './service/category.service';
import {CategoryResolver} from './resolvers/category.resolver';
import {AttestationModule} from '../attestation/attestation.module';

@Module({
  imports: [AttestationModule],
  providers: [CategoryMapper, CategoryService, CategoryResolver],
  exports: [CategoryService]
})
export class CategoryModule {

}
