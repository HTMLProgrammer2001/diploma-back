import {CommissionDbModel} from '../../../db-models/commission.db-model';
import {IPaginator} from '../../../../global/types/interface/IPaginator.interface';

export class CommissionGetRepoResponse {
  data: IPaginator<CommissionDbModel>;
}
