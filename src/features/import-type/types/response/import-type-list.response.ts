import {ObjectType} from '@nestjs/graphql';
import {Paginated, PaginatedData} from '../../../../global/types/response/paginated.response';
import {ImportTypeResponse} from './import-type.response';

@ObjectType({
  implements: [PaginatedData]
})
export class ImportTypeListResponse extends Paginated(ImportTypeResponse) {
}
