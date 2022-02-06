import {IPaginator} from '../../../../global/types/interface/IPaginator.interface';
import {HonorDbModel} from '../../../db-models/honor.db-model';

export class HonorGetRepoResponse {
  data: IPaginator<HonorDbModel>;
}
