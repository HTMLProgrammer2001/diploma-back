import {BaseRepoRequest} from '../../common/base-repo-request';

export class ImportTypeUpdateRepoRequest extends BaseRepoRequest {
  id: number;
  name: string;
}
