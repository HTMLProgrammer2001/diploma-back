import {BaseRepoRequest} from '../../common/base-repo-request';

export class AttestationGetRepoRequest extends BaseRepoRequest {
  page: number;
  size: number;
  id: number;
  ids: Array<number>;
  dateMore: Date;
  dateLess: Date;
  teacherId: number;
  teacherIds: Array<number>;
  categoryId: number;
  showDeleted: boolean;
  showCascadeDeletedBy: string;
  select: Array<string>;
  orderField: string;
  isDesc: boolean;
}
