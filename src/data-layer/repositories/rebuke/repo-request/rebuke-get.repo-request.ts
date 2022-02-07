import {BaseRepoRequest} from '../../common/base-repo-request';

export class RebukeGetRepoRequest extends BaseRepoRequest {
  page: number;
  size: number;
  id: number;
  ids: Array<number>;
  title: string;
  dateMore: Date;
  dateLess: Date;
  orderNumber: string;
  userId: number;
  showDeleted: boolean;
  showInActive: boolean;
  select: Array<string>;
  orderField: string;
  isDesc: boolean;
}
