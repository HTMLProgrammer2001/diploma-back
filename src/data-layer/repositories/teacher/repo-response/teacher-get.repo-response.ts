import {IPaginator} from '../../../../global/types/interface/IPaginator.interface';
import {TeacherDbModel} from '../../../db-models/teacher.db-model';

export class TeacherGetRepoResponse {
  data: IPaginator<TeacherDbModel>;
}
