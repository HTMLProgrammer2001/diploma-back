import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../global/types/response/paginated.response';
import {DepartmentResponse} from './department.response';

@ObjectType({
  implements: [PaginatedData]
})
export class DepartmentListResponse extends Paginated(DepartmentResponse) {
}
