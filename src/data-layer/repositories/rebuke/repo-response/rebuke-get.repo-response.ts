import {IPaginator} from '../../../../global/types/interface/IPaginator.interface';
import {RebukeDbModel} from '../../../db-models/rebuke.db-model';

export class RebukeGetRepoResponse {
  data: IPaginator<RebukeDbModel>;
}
