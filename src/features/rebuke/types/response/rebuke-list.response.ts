import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../global/types/response/paginated.response';
import {RebukeResponse} from './rebuke.response';

@ObjectType({
  implements: [PaginatedData]
})
export class RebukeListResponse extends Paginated(RebukeResponse) {
}
