import {BaseRepoRequest} from '../../common/base-repo-request';

export class EducationGetRepoRequest extends BaseRepoRequest {
  page: number;
  size: number;
  id: number;
  ids: Array<number>;
  institution: string;
  specialty: string;
  yearOfIssueMore: number;
  yearOfIssueLess: number;
  userId: number;
  educationQualificationId: number;
  showDeleted: boolean;
  select: Array<string>;
  orderField: string;
  isDesc: boolean;
}
