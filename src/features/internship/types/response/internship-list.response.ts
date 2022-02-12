import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../global/types/response/paginated.response';
import {InternshipResponse} from './internship.response';

@ObjectType({
  implements: [PaginatedData]
})
export class InternshipListResponse extends Paginated(InternshipResponse) {
}
