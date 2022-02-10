import {BaseRepoRequest} from '../../common/base-repo-request';

export class PublicationGetRepoRequest extends BaseRepoRequest {
  page: number;
  size: number;
  id: number;
  ids: Array<number>;
  title: string;
  dateMore: Date;
  dateLess: Date;
  publisher: string;
  userIds: Array<number>;
  showDeleted: boolean;
  select: Array<string>;
  orderField: string;
  isDesc: boolean;
}
