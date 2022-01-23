import {BaseRepoRequest} from '../../common/base-repo-request';

export class CommissionGetRepoRequest extends BaseRepoRequest {
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
