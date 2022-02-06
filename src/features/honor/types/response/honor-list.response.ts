import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../global/types/response/paginated.response';
import {HonorResponse} from './honor.response';

@ObjectType({
  implements: [PaginatedData]
})
export class HonorListResponse extends Paginated(HonorResponse) {
}
