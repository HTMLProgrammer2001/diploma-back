import {Injectable} from '@nestjs/common';
import {CommissionGetListRequest} from '../types/request/commission-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {CommissionResponse} from '../types/response/commission.response';
import {CommissionGetByIdRequest} from '../types/request/commission-get-by-id.request';
import {CommissionCreateRequest} from '../types/request/commission-create.request';
import {CommissionUpdateRequest} from '../types/request/commission-update.request';
import {CommissionGetRepoRequest} from '../../../data-layer/repositories/commission/repo-request/commission-get.repo-request';
import {CommissionDbModel} from '../../../data-layer/db-models/commission.db-model';
import {CommissionCreateRepoRequest} from '../../../data-layer/repositories/commission/repo-request/commission-create.repo-request';
import {CommissionDeleteRepoRequest} from '../../../data-layer/repositories/commission/repo-request/commission-delete.repo-request';
import {CommissionUpdateRepoRequest} from '../../../data-layer/repositories/commission/repo-request/commission-update.repo-request';

@Injectable()
export class CommissionMapper {
  getCommissionListRequestToRepoRequest(source: CommissionGetListRequest): CommissionGetRepoRequest {
    const destination = new CommissionGetRepoRequest();

    destination.name = source.name;
    destination.showDeleted = source.showDeleted;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  commissionPaginatorDbModelToResponse(source: IPaginator<CommissionDbModel>): IPaginator<CommissionResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.commissionDbModelToResponse(el))
    };
  }

  commissionDbModelToResponse(source: CommissionDbModel): CommissionResponse {
    const destination = new CommissionResponse();

    destination.id = source.id;
    destination.name = source.name;
    destination.guid = source.guid;
    destination.isDeleted = source.isDeleted;

    return destination;
  }

  getCommissionByIdRequestToRepoRequest(source: CommissionGetByIdRequest): CommissionGetRepoRequest {
    const destination = new CommissionGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  initializeGetCommissionByIdRepoRequest(id: number, select: Array<string>): CommissionGetRepoRequest {
    const destination = new CommissionGetRepoRequest();

    destination.id = id;
    destination.select = select;
    destination.showDeleted = true;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createCommissionRequestToRepoRequest(source: CommissionCreateRequest): CommissionCreateRepoRequest {
    const destination = new CommissionCreateRepoRequest();

    destination.name = source.name;

    return destination;
  }

  deleteCommissionRequestToRepoRequest(id: number): CommissionDeleteRepoRequest {
    const destination = new CommissionDeleteRepoRequest();

    destination.id = id;

    return destination;
  }

  updateCommissionRequestToRepoRequest(request: CommissionUpdateRequest): CommissionUpdateRepoRequest {
    const destination = new CommissionUpdateRepoRequest();

    destination.id = request.id;
    destination.name = request.name;

    return destination;
  }
}
