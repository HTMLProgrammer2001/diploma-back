import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../global/types/response/paginated.response';
import {AcademicTitleResponse} from './academic-title.response';

@ObjectType({
  implements: [PaginatedData]
})
export class AcademicTitleListResponse extends Paginated(AcademicTitleResponse) {
}
