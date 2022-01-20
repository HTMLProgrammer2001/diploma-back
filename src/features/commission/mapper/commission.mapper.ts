import {Injectable} from '@nestjs/common';
import {CommissionGetListRequest} from '../types/request/commission-get-list.request';
import {GetCommissionListRepoRequest} from '../../../data/repositories/commission/repo-request/get-commission-list.repo-request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {CommissionDbModel} from '../../../data/db-models/commission.db-model';
import {CommissionResponse} from '../types/response/commission.response';
import {CommissionGetByIdRequest} from '../types/request/commission-get-by-id.request';
import {CommissionCreateRequest} from '../types/request/commission-create.request';
import {CreateCommissionRepoRequest} from '../../../data/repositories/commission/repo-request/create-commission.repo-request';
import {DeleteCommissionRepoRequest} from '../../../data/repositories/commission/repo-request/delete-commission.repo-request';
import {CommissionUpdateRequest} from '../types/request/commission-update.request';
import {UpdateCommissionRepoRequest} from '../../../data/repositories/commission/repo-request/update-commission.repo-request';

@Injectable()
export class CommissionMapper {
  getCommissionListRequestToRepoRequest(source: CommissionGetListRequest): GetCommissionListRepoRequest {
    const destination = new GetCommissionListRepoRequest();

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

  getCommissionByIdRequestToRepoRequest(source: CommissionGetByIdRequest): GetCommissionListRepoRequest {
    const destination = new GetCommissionListRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createCommissionRequestToRepoRequest(source: CommissionCreateRequest): CreateCommissionRepoRequest {
    const destination = new CreateCommissionRepoRequest();

    destination.name = source.name;

    return destination;
  }

  deleteCommissionRequestToRepoRequest(id: number): DeleteCommissionRepoRequest {
    const destination = new DeleteCommissionRepoRequest();

    destination.id = id;

    return destination;
  }

  updateCommissionRequestToRepoRequest(request: CommissionUpdateRequest): UpdateCommissionRepoRequest {
    const destination = new UpdateCommissionRepoRequest();

    destination.id = request.id;
    destination.name = request.name;

    return destination;
  }
}
