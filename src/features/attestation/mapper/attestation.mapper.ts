import {Injectable} from '@nestjs/common';
import {AttestationGetListRequest} from '../types/request/attestation-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {AttestationResponse} from '../types/response/attestation.response';
import {AttestationGetByIdRequest} from '../types/request/attestation-get-by-id.request';
import {AttestationCreateRequest} from '../types/request/attestation-create.request';
import {AttestationUpdateRequest} from '../types/request/attestation-update.request';
import {AttestationGetRepoRequest} from '../../../data-layer/repositories/attestation/repo-request/attestation-get.repo-request';
import {AttestationDbModel} from '../../../data-layer/db-models/attestation.db-model';
import {AttestationCreateRepoRequest} from '../../../data-layer/repositories/attestation/repo-request/attestation-create.repo-request';
import {AttestationUpdateRepoRequest} from '../../../data-layer/repositories/attestation/repo-request/attestation-update.repo-request';
import {AttestationDeleteRepoRequest} from '../../../data-layer/repositories/attestation/repo-request/attestation-delete.repo-request';
import {CategoryGetRepoRequest} from '../../../data-layer/repositories/category/repo-request/category-get.repo-request';
import {CategorySelectFieldsEnum} from '../../../data-layer/repositories/category/enums/category-select-fields.enum';
import {TeacherGetRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-get.repo-request';
import {TeacherSelectFieldsEnum} from '../../../data-layer/repositories/teacher/enums/teacher-select-fields.enum';
import {AttestationGetLastDateRequest} from '../types/request/attestation-get-last-date.request';
import {AttestationSelectFieldsEnum} from '../../../data-layer/repositories/attestation/enums/attestation-select-fields.enum';
import {AttestationOrderFieldsEnum} from '../../../data-layer/repositories/attestation/enums/attestation-order-fields.enum';

@Injectable()
export class AttestationMapper {
  getAttestationListRequestToRepoRequest(source: AttestationGetListRequest): AttestationGetRepoRequest {
    const destination = new AttestationGetRepoRequest();

    destination.dateLess = source.dateLess;
    destination.dateMore = source.dateMore;
    destination.teacherId = source.teacherId;
    destination.categoryId = source.categoryId;
    destination.showDeleted = source.showDeleted;
    destination.showCascadeDeletedBy = source.showCascadeDeletedBy;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  attestationPaginatorDbModelToResponse(source: IPaginator<AttestationDbModel>): IPaginator<AttestationResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.attestationDbModelToResponse(el))
    };
  }

  attestationDbModelToResponse(source: AttestationDbModel): AttestationResponse {
    const destination = new AttestationResponse();

    destination.id = source.id;
    destination.description = source.description;
    destination.date = source.date?.toISOString().split('T')[0];
    destination.isDeleted = source.isDeleted;
    destination.guid = source.guid;

    if (source.teacher) {
      destination.teacher = {
        id: source.teacher.id,
        name: source.teacher.fullName
      };
    }

    if (source.category) {
      destination.category = {
        id: source.category.id,
        name: source.category.name
      };
    }

    return destination;
  }

  getAttestationByIdRequestToRepoRequest(source: AttestationGetByIdRequest): AttestationGetRepoRequest {
    const destination = new AttestationGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.showCascadeDeletedBy = source.showCascadeDeletedBy;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  initializeGetAttestationByIdRepoRequest(id: number, select: Array<string>): AttestationGetRepoRequest {
    const destination = new AttestationGetRepoRequest();

    destination.id = id;
    destination.select = select;
    destination.showDeleted = true;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createAttestationRequestToRepoRequest(source: AttestationCreateRequest): AttestationCreateRepoRequest {
    const destination = new AttestationCreateRepoRequest();

    destination.date = source.date;
    destination.teacherId = source.teacherId;
    destination.description = source.description;
    destination.categoryId = source.categoryId;

    return destination;
  }

  initializeGetTeacherRepoRequest(userId: number): TeacherGetRepoRequest {
    const destination = new TeacherGetRepoRequest();

    destination.id = userId;
    destination.select = [TeacherSelectFieldsEnum.ID, TeacherSelectFieldsEnum.IS_DELETED];
    destination.showDeleted = true;

    return destination;
  }

  initializeGetCategoryRepoRequest(categoryId: number): CategoryGetRepoRequest {
    const destination = new CategoryGetRepoRequest();

    destination.id = categoryId;
    destination.select = [CategorySelectFieldsEnum.ID, CategorySelectFieldsEnum.IS_DELETED];
    destination.showDeleted = true;

    return destination;
  }

  updateAttestationRequestToRepoRequest(source: AttestationUpdateRequest): AttestationUpdateRepoRequest {
    const destination = new AttestationUpdateRepoRequest();

    destination.id = source.id;
    destination.date = source.date;
    destination.description = source.description;
    destination.teacherId = source.teacherId;
    destination.categoryId = source.categoryId;

    return destination;
  }

  deleteAttestationRequestToRepoRequest(id: number): AttestationDeleteRepoRequest {
    const destination = new AttestationDeleteRepoRequest();

    destination.id = id;

    return destination;
  }

  getLastAttestationDateToRepoRequest(source: AttestationGetLastDateRequest): AttestationGetRepoRequest {
    const destination = new AttestationGetRepoRequest();

    destination.select = [AttestationSelectFieldsEnum.DATE];
    destination.teacherId = source.teacherId;
    destination.orderField = AttestationOrderFieldsEnum.DATE;
    destination.isDesc = true;
    destination.size = 1;

    return destination;
  }
}
