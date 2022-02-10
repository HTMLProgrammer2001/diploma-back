import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../global/types/response/paginated.response';
import {PublicationResponse} from './publication.response';

@ObjectType({
  implements: [PaginatedData]
})
export class PublicationListResponse extends Paginated(PublicationResponse) {
}
