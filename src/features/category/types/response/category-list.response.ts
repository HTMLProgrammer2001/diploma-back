import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../global/types/response/paginated.response';
import {CategoryResponse} from './category.response';

@ObjectType({
  implements: [PaginatedData]
})
export class CategoryListResponse extends Paginated(CategoryResponse) {
}
