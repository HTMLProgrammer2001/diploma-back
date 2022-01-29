import {BaseRepoRequest} from '../../common/base-repo-request';

export class RoleUpdateRepoRequest extends BaseRepoRequest {
  id: number;
  name: string;
}
