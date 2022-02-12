import {BaseRepoRequest} from '../../common/base-repo-request';

export class InternshipGetRepoRequest extends BaseRepoRequest {
  page: number;
  size: number;
  id: number;
  ids: Array<number>;
  title: string;
  dateFromMore: Date;
  dateToLess: Date;
  code: string;
  place: string;
  userId: number;
  showDeleted: boolean;
  select: Array<string>;
  orderField: string;
  isDesc: boolean;
}
