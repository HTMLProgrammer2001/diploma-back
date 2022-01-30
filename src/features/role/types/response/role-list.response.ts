import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../global/types/response/paginated.response';
import {RoleResponse} from './role.response';

@ObjectType({
  implements: [PaginatedData]
})
export class RoleListResponse extends Paginated(RoleResponse) {
}
