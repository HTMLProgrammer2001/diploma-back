import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../global/types/response/paginated.response';
import {TeachingRankResponse} from './teaching-rank.response';

@ObjectType({
  implements: [PaginatedData]
})
export class TeachingRankListResponse extends Paginated(TeachingRankResponse) {
}
