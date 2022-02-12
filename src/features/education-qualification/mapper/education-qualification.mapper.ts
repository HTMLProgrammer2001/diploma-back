import {Injectable} from '@nestjs/common';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {EducationQualificationGetRepoRequest} from '../../../data-layer/repositories/education-qualification/repo-request/education-qualification-get.repo-request';
import {EducationQualificationDbModel} from '../../../data-layer/db-models/education-qualification.db-model';
import {EducationQualificationCreateRepoRequest} from '../../../data-layer/repositories/education-qualification/repo-request/education-qualification-create.repo-request';
import {EducationQualificationCreateRequest} from '../types/request/education-qualification-create.request';
import {EducationQualificationUpdateRequest} from '../types/request/education-qualification-update.request';
import {EducationQualificationUpdateRepoRequest} from '../../../data-layer/repositories/education-qualification/repo-request/education-qualification-update.repo-request';
import {EducationQualificationDeleteRepoRequest} from '../../../data-layer/repositories/education-qualification/repo-request/education-qualification-delete.repo-request';
import {EducationQualificationGetListRequest} from '../types/request/education-qualification-get-list.request';
import {EducationQualificationResponse} from '../types/response/education-qualification.response';
import {EducationQualificationGetByIdRequest} from '../types/request/education-qualification-get-by-id.request';

@Injectable()
export class EducationQualificationMapper {
  getEducationQualificationListRequestToRepoRequest(source: EducationQualificationGetListRequest): EducationQualificationGetRepoRequest {
    const destination = new EducationQualificationGetRepoRequest();

    destination.name = source.name;
    destination.showDeleted = source.showDeleted;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  educationQualificationPaginatorDbModelToResponse(source: IPaginator<EducationQualificationDbModel>):
    IPaginator<EducationQualificationResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.educationQualificationDbModelToResponse(el))
    };
  }

  educationQualificationDbModelToResponse(source: EducationQualificationDbModel): EducationQualificationResponse {
    const destination = new EducationQualificationResponse();

    destination.id = source.id;
    destination.name = source.name;
    destination.guid = source.guid;
    destination.isDeleted = source.isDeleted;

    return destination;
  }

  getEducationQualificationByIdRequestToRepoRequest(source: EducationQualificationGetByIdRequest):
    EducationQualificationGetRepoRequest {
    const destination = new EducationQualificationGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createEducationQualificationRequestToRepoRequest(source: EducationQualificationCreateRequest):
    EducationQualificationCreateRepoRequest {
    const destination = new EducationQualificationCreateRepoRequest();

    destination.name = source.name;

    return destination;
  }

  initializeEducationQualificationGetByIdRepoRequest(id: number, select: Array<string>): EducationQualificationGetRepoRequest {
    const destination = new EducationQualificationGetRepoRequest();

    destination.id = id
    destination.select = select;
    destination.showDeleted = true;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  updateEducationQualificationRequestToRepoRequest(source: EducationQualificationUpdateRequest):
    EducationQualificationUpdateRepoRequest {
    const destination = new EducationQualificationUpdateRepoRequest();

    destination.id = source.id;
    destination.name = source.name;

    return destination;
  }

  deleteEducationQualificationRequestToRepoRequest(id: number): EducationQualificationDeleteRepoRequest {
    const destination = new EducationQualificationDeleteRepoRequest();

    destination.id = id;

    return destination;
  }
}
