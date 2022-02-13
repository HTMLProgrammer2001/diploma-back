import {IPaginator} from '../../../../global/types/interface/IPaginator.interface';
import {EducationDbModel} from '../../../db-models/education.db-model';

export class EducationGetRepoResponse {
  data: IPaginator<EducationDbModel>;
}
