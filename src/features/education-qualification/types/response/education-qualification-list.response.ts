import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../global/types/response/paginated.response';
import {EducationQualificationResponse} from './education-qualification.response';

@ObjectType({
  implements: [PaginatedData]
})
export class EducationQualificationListResponse extends Paginated(EducationQualificationResponse) {
}
