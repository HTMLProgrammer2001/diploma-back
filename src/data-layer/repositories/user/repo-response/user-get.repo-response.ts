import {IPaginator} from '../../../../global/types/interface/IPaginator.interface';
import {UserDbModel} from '../../../db-models/user.db-model';

export class UserGetRepoResponse {
  data: IPaginator<UserDbModel>;
}
