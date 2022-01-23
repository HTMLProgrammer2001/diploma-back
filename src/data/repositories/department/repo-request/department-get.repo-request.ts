import {BaseRepoRequest} from '../../common/base-repo-request';

export class DepartmentGetRepoRequest extends BaseRepoRequest {
  page: number;
  size: number;
  id: number;
  ids: Array<number>;
  name: string;
  showDeleted: boolean;
  select: Array<string>;
  orderField: string;
  isDesc: boolean;
}
