import {IPaginator} from '../../../../global/types/interface/IPaginator.interface';
import {TeachingRankDbModel} from '../../../db-models/teaching-rank.db-model';

export class TeachingRankGetRepoResponse {
  data: IPaginator<TeachingRankDbModel>;
}
