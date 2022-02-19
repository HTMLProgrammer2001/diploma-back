import {IPaginator} from '../../../../global/types/interface/IPaginator.interface';
import {AttestationDbModel} from '../../../db-models/attestation.db-model';

export class AttestationGetRepoResponse {
  data: IPaginator<AttestationDbModel>;
}
