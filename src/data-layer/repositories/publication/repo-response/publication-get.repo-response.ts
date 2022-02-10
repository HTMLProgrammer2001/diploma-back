import {IPaginator} from '../../../../global/types/interface/IPaginator.interface';
import {PublicationDbModel} from '../../../db-models/publication.db-model';

export class PublicationGetRepoResponse {
  data: IPaginator<PublicationDbModel>;
}
