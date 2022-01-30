import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../global/types/response/paginated.response';
import {UserResponse} from './user.response';

@ObjectType({
  implements: [PaginatedData]
})
export class UserListResponse extends Paginated(UserResponse) {
}
