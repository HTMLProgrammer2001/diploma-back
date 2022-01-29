import {BaseRepoRequest} from '../../common/base-repo-request';

export class TeachingRankGetRepoRequest extends BaseRepoRequest {
  page: number;
  size: number;
  id: number;
  ids: Array<number>;
  name: string;
  select: Array<string>;
  showDeleted: boolean;
  orderField: string;
  isDesc: boolean;
}
