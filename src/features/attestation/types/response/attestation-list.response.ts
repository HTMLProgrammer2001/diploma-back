import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../global/types/response/paginated.response';
import {AttestationResponse} from './attestation.response';

@ObjectType({
  implements: [PaginatedData]
})
export class AttestationListResponse extends Paginated(AttestationResponse) {
}
