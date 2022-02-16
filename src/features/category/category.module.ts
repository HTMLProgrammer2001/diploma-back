import {Module} from '@nestjs/common';
import {CategoryMapper} from './mapper/category.mapper';
import {CategoryService} from './service/category.service';
import {CategoryResolver} from './resolvers/category.resolver';

@Module({
  providers: [CategoryMapper, CategoryService, CategoryResolver]
})
export class CategoryModule {

}
