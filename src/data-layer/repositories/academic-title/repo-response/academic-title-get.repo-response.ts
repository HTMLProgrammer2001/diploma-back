import {IPaginator} from '../../../../common/types/interface/IPaginator.interface';
import {AcademicTitleDbModel} from '../../../db-models/academic-title.db-model';

export class AcademicTitleGetRepoResponse {
  data: IPaginator<AcademicTitleDbModel>;
}
