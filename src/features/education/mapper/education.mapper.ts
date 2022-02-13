import {Injectable} from '@nestjs/common';
import {RebukeGetRepoRequest} from '../../../data-layer/repositories/rebuke/repo-request/rebuke-get.repo-request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {RebukeDbModel} from '../../../data-layer/db-models/rebuke.db-model';
import {RebukeCreateRepoRequest} from '../../../data-layer/repositories/rebuke/repo-request/rebuke-create.repo-request';
import {UserGetRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-get.repo-request';
import {UserSelectFieldsEnum} from '../../../data-layer/repositories/user/enums/user-select-fields.enum';
import {RebukeUpdateRepoRequest} from '../../../data-layer/repositories/rebuke/repo-request/rebuke-update.repo-request';
import {RebukeDeleteRepoRequest} from '../../../data-layer/repositories/rebuke/repo-request/rebuke-delete.repo-request';
import {EducationQualificationGetRepoRequest} from '../../../data-layer/repositories/education-qualification/repo-request/education-qualification-get.repo-request';
import {EducationQualificationSelectFieldsEnum} from '../../../data-layer/repositories/education-qualification/enums/education-qualification-select-fields.enum';
import {EducationGetListRequest} from '../types/request/education-get-list.request';
import {EducationGetRepoRequest} from '../../../data-layer/repositories/education/repo-request/education-get.repo-request';
import {EducationResponse} from '../types/response/education.response';
import {EducationDbModel} from '../../../data-layer/db-models/education.db-model';
import {EducationGetByIdRequest} from '../types/request/education-get-by-id.request';
import {EducationCreateRequest} from '../types/request/education-create.request';
import {EducationCreateRepoRequest} from '../../../data-layer/repositories/education/repo-request/education-create.repo-request';
import {EducationUpdateRequest} from '../types/request/education-update.request';
import {EducationUpdateRepoRequest} from '../../../data-layer/repositories/education/repo-request/education-update.repo-request';
import {EducationDeleteRepoRequest} from '../../../data-layer/repositories/education/repo-request/education-delete.repo-request';

@Injectable()
export class EducationMapper {
  getRebukeListRequestToRepoRequest(source: EducationGetListRequest): EducationGetRepoRequest {
    const destination = new EducationGetRepoRequest();

    destination.educationQualificationId = source.educationQualificationId;
    destination.userId = source.userId;
    destination.yearOfIssueLess = source.yearOfIssueLess;
    destination.yearOfIssueMore = source.yearOfIssueMore;
    destination.specialty = source.specialty;
    destination.institution = source.institution;
    destination.showDeleted = source.showDeleted;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  educationPaginatorDbModelToResponse(source: IPaginator<EducationDbModel>): IPaginator<EducationResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.educationDbModelToResponse(el))
    };
  }

  educationDbModelToResponse(source: EducationDbModel): EducationResponse {
    const destination = new EducationResponse();

    destination.id = source.id;
    destination.description = source.description;
    destination.institution = source.institution;
    destination.specialty = source.specialty;
    destination.yearOfIssue = source.yearOfIssue;
    destination.isDeleted = source.isDeleted;
    destination.guid = source.guid;

    if (source.user) {
      destination.user = {
        id: source.user.id,
        name: source.user.fullName
      };
    }

    if (source.educationQualification) {
      destination.educationQualification = {
        id: source.educationQualification.id,
        name: source.educationQualification.name
      };
    }

    return destination;
  }

  getEducationByIdRequestToRepoRequest(source: EducationGetByIdRequest): EducationGetRepoRequest {
    const destination = new EducationGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  initializeGetEducationByIdRepoRequest(id: number, select: Array<string>): EducationGetRepoRequest {
    const destination = new EducationGetRepoRequest();

    destination.id = id;
    destination.select = select;
    destination.showDeleted = true;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createEducationRequestToRepoRequest(source: EducationCreateRequest): EducationCreateRepoRequest {
    const destination = new EducationCreateRepoRequest();

    destination.userId = source.userId;
    destination.educationQualificationId = source.educationQualificationId;
    destination.description = source.description;
    destination.institution = source.institution;
    destination.specialty = source.specialty;
    destination.yearOfIssue = source.yearOfIssue;

    return destination;
  }

  initializeGetUserRepoRequest(userId: number): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.id = userId;
    destination.select = [UserSelectFieldsEnum.ID, UserSelectFieldsEnum.IS_DELETED];
    destination.showDeleted = true;

    return destination;
  }

  initializeGetEducationQualificationRepoRequest(userId: number): EducationQualificationGetRepoRequest {
    const destination = new EducationQualificationGetRepoRequest();

    destination.id = userId;
    destination.select = [EducationQualificationSelectFieldsEnum.ID, EducationQualificationSelectFieldsEnum.IS_DELETED];
    destination.showDeleted = true;

    return destination;
  }

  updateEducationRequestToRepoRequest(source: EducationUpdateRequest): EducationUpdateRepoRequest {
    const destination = new EducationUpdateRepoRequest();

    destination.id = source.id;
    destination.description = source.description;
    destination.userId = source.userId;
    destination.educationQualificationId = source.educationQualificationId;
    destination.specialty = source.specialty;
    destination.institution = source.institution;
    destination.yearOfIssue = source.yearOfIssue;

    return destination;
  }

  deleteEducationRequestToRepoRequest(id: number): EducationDeleteRepoRequest {
    const destination = new EducationDeleteRepoRequest();

    destination.id = id;

    return destination;
  }
}
