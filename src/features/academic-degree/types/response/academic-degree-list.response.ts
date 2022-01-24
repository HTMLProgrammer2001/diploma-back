import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../common/types/response/paginated.response';
import {AcademicDegreeResponse} from './academic-degree.response';

@ObjectType({
  implements: [PaginatedData]
})
export class AcademicDegreeListResponse extends Paginated(AcademicDegreeResponse) {
}
