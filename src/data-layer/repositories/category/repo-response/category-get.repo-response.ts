import {IPaginator} from '../../../../global/types/interface/IPaginator.interface';
import {CategoryDbModel} from '../../../db-models/category.db-model';

export class CategoryGetRepoResponse {
  data: IPaginator<CategoryDbModel>;
}
