import {BaseRepoRequest} from '../../common/base-repo-request';

export class AttestationGetRepoRequest extends BaseRepoRequest {
  page: number;
  size: number;
  id: number;
  ids: Array<number>;
  dateMore: Date;
  dateLess: Date;
  userId: number;
  categoryId: number;
  showDeleted: boolean;
  select: Array<string>;
  orderField: string;
  isDesc: boolean;
}
