import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../common/types/response/paginated.response';
import {TeacherResponse} from './teacher.response';

@ObjectType({
  implements: [PaginatedData]
})
export class TeacherListResponse extends Paginated(TeacherResponse) {
}
