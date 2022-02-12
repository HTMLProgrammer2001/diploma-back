import {IPaginator} from '../../../../global/types/interface/IPaginator.interface';
import {InternshipDbModel} from '../../../db-models/internship.db-model';

export class InternshipGetRepoResponse {
  data: IPaginator<InternshipDbModel>;
}
