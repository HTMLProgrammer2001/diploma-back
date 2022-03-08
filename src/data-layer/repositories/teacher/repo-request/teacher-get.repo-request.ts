import {BaseRepoRequest} from '../../common/base-repo-request';

export class TeacherGetRepoRequest extends BaseRepoRequest {
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
  departmentId: number;
  commissionId: number;
  teacherRankId: number;
  academicDegreeId: number;
  academicTitleId: number;
  showDeleted: boolean;
  showCascadeDeletedBy: string;
  select: Array<string>;
  orderField: string;
  isDesc: boolean;
}
