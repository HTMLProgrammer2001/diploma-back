import {IPaginator} from '../../../../global/types/interface/IPaginator.interface';
import {ImportTypeDbModel} from '../../../db-models/import-type.db-model';

export class ImportTypeGetRepoResponse {
  data: IPaginator<ImportTypeDbModel>;
}
