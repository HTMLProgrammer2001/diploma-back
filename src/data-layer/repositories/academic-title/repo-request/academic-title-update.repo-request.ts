import {BaseRepoRequest} from '../../common/base-repo-request';

export class AcademicTitleUpdateRepoRequest extends BaseRepoRequest {
  id: number;
  name?: string;
}
