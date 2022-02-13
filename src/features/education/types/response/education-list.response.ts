import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../global/types/response/paginated.response';
import {EducationResponse} from './education.response';

@ObjectType({
  implements: [PaginatedData]
})
export class EducationListResponse extends Paginated(EducationResponse) {
}
