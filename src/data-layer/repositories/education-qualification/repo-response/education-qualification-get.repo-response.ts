import {IPaginator} from '../../../../global/types/interface/IPaginator.interface';
import {EducationQualificationDbModel} from '../../../db-models/education-qualification.db-model';

export class EducationQualificationGetRepoResponse {
  data: IPaginator<EducationQualificationDbModel>;
}
