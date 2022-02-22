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
  orderNumberEqual: string;
  teacherId: number;
  teacherIds: Array<number>;
  showDeleted: boolean;
  showCascadeDeletedBy: string;
  showInActive: boolean;
  select: Array<string>;
  orderField: string;
  isDesc: boolean;
}
