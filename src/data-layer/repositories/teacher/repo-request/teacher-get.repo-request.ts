import {BaseRepoRequest} from '../../common/base-repo-request';

export class TeacherGetRepoRequest extends BaseRepoRequest {
  page: number;
  size: number;
  id: number;
  ids: Array<number>;
  fullName: string;
  email: string;
  emailEqual: string;
  phoneEqual: string;
  departmentId: number;
  commissionId: number;
  teacherRankId: number;
  academicDegreeId: number;
  academicTitleId: number;
  showDeleted: boolean;
  select: Array<string>;
  orderField: string;
  isDesc: boolean;
}
