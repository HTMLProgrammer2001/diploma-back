import {BaseRepoRequest} from '../../common/base-repo-request';

export class CategoryUpdateRepoRequest extends BaseRepoRequest {
  id: number;
  name: string;
}
