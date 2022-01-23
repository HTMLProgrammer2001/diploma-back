import {CommissionDbModel} from '../../../db-models/commission.db-model';
import {IPaginator} from '../../../../common/types/interface/IPaginator.interface';

export class CommissionGetRepoResponse {
  data: IPaginator<CommissionDbModel>;
}
