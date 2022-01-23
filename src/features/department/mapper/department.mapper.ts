import {Injectable} from '@nestjs/common';
import {DepartmentGetListRequest} from '../types/request/department-get-list.request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {DepartmentResponse} from '../types/response/department.response';
import {DepartmentGetByIdRequest} from '../types/request/department-get-by-id.request';
import {DepartmentCreateRequest} from '../types/request/department-create.request';
import {DepartmentUpdateRequest} from '../types/request/department-update.request';
import {DepartmentGetRepoRequest} from '../../../data-layer/repositories/department/repo-request/department-get.repo-request';
import {DepartmentDbModel} from '../../../data-layer/db-models/department.db-model';
import {DepartmentCreateRepoRequest} from '../../../data-layer/repositories/department/repo-request/department-create.repo-request';
import {DepartmentDeleteRepoRequest} from '../../../data-layer/repositories/department/repo-request/department-delete.repo-request';
import {DepartmentUpdateRepoRequest} from '../../../data-layer/repositories/department/repo-request/department-update.repo-request';

@Injectable()
export class DepartmentMapper {
  getDepartmentListRequestToRepoRequest(source: DepartmentGetListRequest): DepartmentGetRepoRequest {
    const destination = new DepartmentGetRepoRequest();

    destination.name = source.name;
    destination.showDeleted = source.showDeleted;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  departmentPaginatorDbModelToResponse(source: IPaginator<DepartmentDbModel>): IPaginator<DepartmentResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.departmentDbModelToResponse(el))
    };
  }

  departmentDbModelToResponse(source: DepartmentDbModel): DepartmentResponse {
    const destination = new DepartmentResponse();

    destination.id = source.id;
    destination.name = source.name;
    destination.guid = source.guid;
    destination.isDeleted = source.isDeleted;

    return destination;
  }

  getDepartmentByIdRequestToRepoRequest(source: DepartmentGetByIdRequest): DepartmentGetRepoRequest {
    const destination = new DepartmentGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createDepartmentRequestToRepoRequest(source: DepartmentCreateRequest): DepartmentCreateRepoRequest {
    const destination = new DepartmentCreateRepoRequest();

    destination.name = source.name;

    return destination;
  }

  deleteDepartmentRequestToRepoRequest(id: number): DepartmentDeleteRepoRequest {
    const destination = new DepartmentDeleteRepoRequest();

    destination.id = id;

    return destination;
  }

  updateDepartmentRequestToRepoRequest(request: DepartmentUpdateRequest): DepartmentUpdateRepoRequest {
    const destination = new DepartmentUpdateRepoRequest();

    destination.id = request.id;
    destination.name = request.name;

    return destination;
  }
}
