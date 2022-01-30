import {IPaginator} from '../../../../global/types/interface/IPaginator.interface';
import {RoleDbModel} from '../../../db-models/role.db-model';

export class RoleGetRepoResponse {
  data: IPaginator<RoleDbModel>;
}
