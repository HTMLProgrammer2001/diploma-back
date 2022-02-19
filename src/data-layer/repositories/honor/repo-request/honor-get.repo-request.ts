import {BaseRepoRequest} from '../../common/base-repo-request';

export class HonorGetRepoRequest extends BaseRepoRequest {
  page: number;
  size: number;
  id: number;
  ids: Array<number>;
  title: string;
  dateMore: Date;
  dateLess: Date;
  orderNumber: string;
  orderNumberEqual: string;
  teacherId: number;
  showDeleted: boolean;
  showCascadeDeleted: boolean;
  showInActive: boolean;
  select: Array<string>;
  orderField: string;
  isDesc: boolean;
}
