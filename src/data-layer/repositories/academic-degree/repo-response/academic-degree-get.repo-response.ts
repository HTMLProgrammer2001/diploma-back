import {IPaginator} from '../../../../common/types/interface/IPaginator.interface';
import {AcademicDegreeDbModel} from '../../../db-models/academic-degree.db-model';

export class AcademicDegreeGetRepoResponse {
  data: IPaginator<AcademicDegreeDbModel>;
}
