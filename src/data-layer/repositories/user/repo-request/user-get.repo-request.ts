import {BaseRepoRequest} from '../../common/base-repo-request';

export class UserGetRepoRequest extends BaseRepoRequest {
  page: number;
  size: number;
  id: number;
  ids: Array<number>;
  fullName: string;
  email: string;
  emailEqual: string;
  emailIn: Array<string>;
  phoneEqual: string;
  phoneIn: Array<string>;
  roleId: number;
  showDeleted: boolean;
  select: Array<string>;
  orderField: string;
  isDesc: boolean;
}
