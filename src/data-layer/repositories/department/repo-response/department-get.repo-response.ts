import {IPaginator} from '../../../../common/types/interface/IPaginator.interface';
import {DepartmentDbModel} from '../../../db-models/department.db-model';

export class DepartmentGetRepoResponse {
  data: IPaginator<DepartmentDbModel>;
}
