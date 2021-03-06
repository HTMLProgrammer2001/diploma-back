import {Injectable} from '@nestjs/common';
import {HonorGetListRequest} from '../types/request/honor-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {HonorResponse} from '../types/response/honor.response';
import {HonorGetByIdRequest} from '../types/request/honor-get-by-id.request';
import {HonorCreateRequest} from '../types/request/honor-create.request';
import {HonorUpdateRequest} from '../types/request/honor-update.request';
import {HonorGetRepoRequest} from '../../../data-layer/repositories/honor/repo-request/honor-get.repo-request';
import {HonorDbModel} from '../../../data-layer/db-models/honor.db-model';
import {HonorCreateRepoRequest} from '../../../data-layer/repositories/honor/repo-request/honor-create.repo-request';
import {HonorUpdateRepoRequest} from '../../../data-layer/repositories/honor/repo-request/honor-update.repo-request';
import {HonorDeleteRepoRequest} from '../../../data-layer/repositories/honor/repo-request/honor-delete.repo-request';
import {HonorSelectFieldsEnum} from '../../../data-layer/repositories/honor/enums/honor-select-fields.enum';
import {TeacherGetRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-get.repo-request';
import {TeacherSelectFieldsEnum} from '../../../data-layer/repositories/teacher/enums/teacher-select-fields.enum';

@Injectable()
export class HonorMapper {
  getHonorListRequestToRepoRequest(source: HonorGetListRequest): HonorGetRepoRequest {
    const destination = new HonorGetRepoRequest();

    destination.title = source.title;
    destination.dateLess = source.dateLess;
    destination.dateMore = source.dateMore;
    destination.teacherId = source.teacherId;
    destination.orderNumber = source.orderNumber;
    destination.showInActive = source.showInActive;
    destination.showDeleted = source.showDeleted;
    destination.showCascadeDeletedBy = source.showCascadeDeletedBy;
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

    if (source.teacher) {
      destination.teacher = {
        id: source.teacher.id,
        name: source.teacher.fullName
      };
    }

    return destination;
  }

  getHonorByIdRequestToRepoRequest(source: HonorGetByIdRequest): HonorGetRepoRequest {
    const destination = new HonorGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.showCascadeDeletedBy = source.showCascadeDeletedBy;
    destination.showInActive = true;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  initializeGetHonorByIdRepoRequest(id: number, select: Array<string>): HonorGetRepoRequest {
    const destination = new HonorGetRepoRequest();

    destination.id = id;
    destination.select = select;
    destination.showDeleted = true;
    destination.showInActive = true;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createHonorRequestToRepoRequest(source: HonorCreateRequest): HonorCreateRepoRequest {
    const destination = new HonorCreateRepoRequest();

    destination.date = source.date;
    destination.teacherId = source.teacherId;
    destination.description = source.description;
    destination.title = source.title;
    destination.isActive = source.isActive;
    destination.orderNumber = source.orderNumber;

    return destination;
  }

  initializeGetTeacherRepoRequest(userId: number): TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    destination.id = userId;
    destination.select = [TeacherSelectFieldsEnum.ID, TeacherSelectFieldsEnum.IS_DELETED];
    destination.showDeleted = true;

    return destination;
  }

  updateHonorRequestToRepoRequest(source: HonorUpdateRequest): HonorUpdateRepoRequest {
    const destination = new HonorUpdateRepoRequest();

    destination.id = source.id;
    destination.title = source.title;
    destination.date = source.date;
    destination.description = source.description;
    destination.teacherId = source.teacherId;
    destination.orderNumber = source.orderNumber;

    return destination;
  }

  deleteHonorRequestToRepoRequest(id: number): HonorDeleteRepoRequest {
    const destination = new HonorDeleteRepoRequest();

    destination.id = id;

    return destination;
  }
}
