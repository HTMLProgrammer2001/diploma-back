import {Injectable} from '@nestjs/common';
import {HonorGetListRequest} from '../types/request/honor-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {HonorResponse} from '../types/response/honor.response';
import {HonorGetByIdRequest} from '../types/request/honor-get-by-id.request';
import {TeacherGetRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-get.repo-request';
import {TeacherDbModel} from '../../../data-layer/db-models/teacher.db-model';
import {HonorCreateRequest} from '../types/request/honor-create.request';
import {TeacherCreateRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-create.repo-request';
import {CommissionGetRepoRequest} from '../../../data-layer/repositories/commission/repo-request/commission-get.repo-request';
import {CommissionSelectFieldsEnum} from '../../../data-layer/repositories/commission/enums/commission-select-fields.enum';
import {DepartmentGetRepoRequest} from '../../../data-layer/repositories/department/repo-request/department-get.repo-request';
import {DepartmentSelectFieldsEnum} from '../../../data-layer/repositories/department/enums/department-select-fields.enum';
import {TeachingRankGetRepoRequest} from '../../../data-layer/repositories/teaching-rank/repo-request/teaching-rank-get.repo-request';
import {TeachingRankSelectFieldsEnum} from '../../../data-layer/repositories/teaching-rank/enums/teaching-rank-select-fields.enum';
import {AcademicDegreeGetRepoRequest} from '../../../data-layer/repositories/academic-degree/repo-request/academic-degree-get.repo-request';
import {AcademicDegreeSelectFieldsEnum} from '../../../data-layer/repositories/academic-degree/enums/academic-degree-select-fields.enum';
import {AcademicTitleGetRepoRequest} from '../../../data-layer/repositories/academic-title/repo-request/academic-title-get.repo-request';
import {AcademicTitleSelectFieldsEnum} from '../../../data-layer/repositories/academic-title/enums/academic-title-select-fields.enum';
import {TeacherSelectFieldsEnum} from '../../../data-layer/repositories/teacher/enums/teacher-select-fields.enum';
import {TeacherDeleteRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-delete.repo-request';
import {HonorUpdateRequest} from '../types/request/honor-update.request';
import {TeacherUpdateRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-update.repo-request';
import {HonorGetRepoRequest} from '../../../data-layer/repositories/honor/repo-request/honor-get.repo-request';
import {HonorDbModel} from '../../../data-layer/db-models/honor.db-model';
import {HonorCreateRepoRequest} from '../../../data-layer/repositories/honor/repo-request/honor-create.repo-request';
import {HonorUpdateRepoRequest} from '../../../data-layer/repositories/honor/repo-request/honor-update.repo-request';
import {HonorDeleteRepoRequest} from '../../../data-layer/repositories/honor/repo-request/honor-delete.repo-request';
import {UserGetRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-get.repo-request';
import {UserSelectFieldsEnum} from '../../../data-layer/repositories/user/enums/user-select-fields.enum';

@Injectable()
export class HonorMapper {
  getHonorListRequestToRepoRequest(source: HonorGetListRequest): HonorGetRepoRequest {
    const destination = new HonorGetRepoRequest();

    destination.title = source.title;
    destination.dateLess = source.dateLess;
    destination.dateMore = source.dateMore;
    destination.userId = source.userId;
    destination.orderNumber = source.orderNumber;
    destination.showInActive = source.showInActive;
    destination.showDeleted = source.showDeleted;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  honorPaginatorDbModelToResponse(source: IPaginator<HonorDbModel>): IPaginator<HonorResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.honorDbModelToResponse(el))
    };
  }

  honorDbModelToResponse(source: HonorDbModel): HonorResponse {
    const destination = new HonorResponse();

    destination.id = source.id;
    destination.title = source.title;
    destination.description = source.description;
    destination.date = source.date?.toISOString().split('T')[0];
    destination.isActive = source.isActive;
    destination.orderNumber = source.orderNumber;
    destination.isDeleted = source.isDeleted;
    destination.guid = source.guid;

    if (source.user) {
      destination.user = {
        id: source.user.id,
        name: source.user.fullName
      };
    }

    return destination;
  }

  getHonorByIdRequestToRepoRequest(source: HonorGetByIdRequest): HonorGetRepoRequest {
    const destination = new HonorGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  initializeGetHonorByIdRepoRequest(id: number, select: Array<string>): HonorGetRepoRequest {
    const destination = new HonorGetRepoRequest();

    destination.id = id;
    destination.select = select;
    destination.showDeleted = true;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createHonorRequestToRepoRequest(source: HonorCreateRequest): HonorCreateRepoRequest {
    const destination = new HonorCreateRepoRequest();

    destination.date = source.date;
    destination.userId = source.userId;
    destination.description = source.description;
    destination.title = source.title;
    destination.isActive = source.isActive;
    destination.orderNumber = source.orderNumber;

    return destination;
  }

  initializeGetUserRepoRequest(userId: number): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.id = userId;
    destination.select = [UserSelectFieldsEnum.ID, UserSelectFieldsEnum.IS_DELETED];
    destination.showDeleted = true;

    return destination;
  }

  updateHonorRequestToRepoRequest(source: HonorUpdateRequest): HonorUpdateRepoRequest {
    const destination = new HonorUpdateRepoRequest();

    destination.id = source.id;
    destination.title = source.title;
    destination.date = source.date;
    destination.description = source.description;
    destination.userId = source.userId;
    destination.orderNumber = source.orderNumber;

    return destination;
  }

  deleteHonorRequestToRepoRequest(id: number): HonorDeleteRepoRequest {
    const destination = new HonorDeleteRepoRequest();

    destination.id = id;

    return destination;
  }
}
