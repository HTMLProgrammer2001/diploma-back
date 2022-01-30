import {ObjectType} from '@nestjs/graphql';
import {Paginated} from '../../../../global/types/response/paginated.response';
import {CommissionResponse} from './commission.response';

@ObjectType()
export class CommissionListResponse extends Paginated(CommissionResponse) {

}
