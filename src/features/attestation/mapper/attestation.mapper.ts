import {Injectable} from '@nestjs/common';
import {AttestationGetListRequest} from '../types/request/attestation-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {AttestationResponse} from '../types/response/attestation.response';
import {AttestationGetByIdRequest} from '../types/request/attestation-get-by-id.request';
import {AttestationCreateRequest} from '../types/request/attestation-create.request';
import {UserGetRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-get.repo-request';
import {UserSelectFieldsEnum} from '../../../data-layer/repositories/user/enums/user-select-fields.enum';
import {AttestationUpdateRequest} from '../types/request/attestation-update.request';
import {AttestationGetRepoRequest} from '../../../data-layer/repositories/attestation/repo-request/attestation-get.repo-request';
import {AttestationDbModel} from '../../../data-layer/db-models/attestation.db-model';
import {AttestationCreateRepoRequest} from '../../../data-layer/repositories/attestation/repo-request/attestation-create.repo-request';
import {AttestationUpdateRepoRequest} from '../../../data-layer/repositories/attestation/repo-request/attestation-update.repo-request';
import {AttestationDeleteRepoRequest} from '../../../data-layer/repositories/attestation/repo-request/attestation-delete.repo-request';
import {CategoryGetRepoRequest} from '../../../data-layer/repositories/category/repo-request/category-get.repo-request';
import {CategorySelectFieldsEnum} from '../../../data-layer/repositories/category/enums/category-select-fields.enum';

@Injectable()
export class AttestationMapper {
  getAttestationListRequestToRepoRequest(source: AttestationGetListRequest): AttestationGetRepoRequest {
    const destination = new AttestationGetRepoRequest();

    destination.dateLess = source.dateLess;
    destination.dateMore = source.dateMore;
    destination.userId = source.userId;
    destination.categoryId = source.categoryId;
    destination.showDeleted = source.showDeleted;
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

    if (source.user) {
      destination.user = {
        id: source.user.id,
        name: source.user.fullName
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

  createRebukeRequestToRepoRequest(source: AttestationCreateRequest): AttestationCreateRepoRequest {
    const destination = new AttestationCreateRepoRequest();

    destination.date = source.date;
    destination.userId = source.userId;
    destination.description = source.description;
    destination.categoryId = source.categoryId;

    return destination;
  }

  initializeGetUserRepoRequest(userId: number): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.id = userId;
    destination.select = [UserSelectFieldsEnum.ID, UserSelectFieldsEnum.IS_DELETED];
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
    destination.userId = source.userId;
    destination.categoryId = source.categoryId;

    return destination;
  }

  deleteAttestationRequestToRepoRequest(id: number): AttestationDeleteRepoRequest {
    const destination = new AttestationDeleteRepoRequest();

    destination.id = id;

    return destination;
  }
}
