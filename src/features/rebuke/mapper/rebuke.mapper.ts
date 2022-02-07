import {Injectable} from '@nestjs/common';
import {RebukeGetListRequest} from '../types/request/rebuke-get-list.request';
import {RebukeGetRepoRequest} from '../../../data-layer/repositories/rebuke/repo-request/rebuke-get.repo-request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {RebukeDbModel} from '../../../data-layer/db-models/rebuke.db-model';
import {RebukeResponse} from '../types/response/rebuke.response';
import {RebukeGetByIdRequest} from '../types/request/rebuke-get-by-id.request';
import {RebukeCreateRequest} from '../types/request/rebuke-create.request';
import {RebukeCreateRepoRequest} from '../../../data-layer/repositories/rebuke/repo-request/rebuke-create.repo-request';
import {UserGetRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-get.repo-request';
import {UserSelectFieldsEnum} from '../../../data-layer/repositories/user/enums/user-select-fields.enum';
import {RebukeUpdateRequest} from '../types/request/rebuke-update.request';
import {RebukeUpdateRepoRequest} from '../../../data-layer/repositories/rebuke/repo-request/rebuke-update.repo-request';
import {RebukeDeleteRepoRequest} from '../../../data-layer/repositories/rebuke/repo-request/rebuke-delete.repo-request';

@Injectable()
export class RebukeMapper {
  getRebukeListRequestToRepoRequest(source: RebukeGetListRequest): RebukeGetRepoRequest {
    const destination = new RebukeGetRepoRequest();

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

  rebukePaginatorDbModelToResponse(source: IPaginator<RebukeDbModel>): IPaginator<RebukeResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.rebukeDbModelToResponse(el))
    };
  }

  rebukeDbModelToResponse(source: RebukeDbModel): RebukeResponse {
    const destination = new RebukeResponse();

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

  getRebukeByIdRequestToRepoRequest(source: RebukeGetByIdRequest): RebukeGetRepoRequest {
    const destination = new RebukeGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  initializeGetRebukeByIdRepoRequest(id: number, select: Array<string>): RebukeGetRepoRequest {
    const destination = new RebukeGetRepoRequest();

    destination.id = id;
    destination.select = select;
    destination.showDeleted = true;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createRebukeRequestToRepoRequest(source: RebukeCreateRequest): RebukeCreateRepoRequest {
    const destination = new RebukeCreateRepoRequest();

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

  updateRebukeRequestToRepoRequest(source: RebukeUpdateRequest): RebukeUpdateRepoRequest {
    const destination = new RebukeUpdateRepoRequest();

    destination.id = source.id;
    destination.title = source.title;
    destination.date = source.date;
    destination.description = source.description;
    destination.userId = source.userId;
    destination.orderNumber = source.orderNumber;

    return destination;
  }

  deleteRebukeRequestToRepoRequest(id: number): RebukeDeleteRepoRequest {
    const destination = new RebukeDeleteRepoRequest();

    destination.id = id;

    return destination;
  }
}
