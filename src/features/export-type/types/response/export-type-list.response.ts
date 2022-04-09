import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../global/types/response/paginated.response';
import {ExportTypeResponse} from './export-type.response';

@ObjectType({
  implements: [PaginatedData]
})
export class ExportTypeListResponse extends Paginated(ExportTypeResponse) {
}
