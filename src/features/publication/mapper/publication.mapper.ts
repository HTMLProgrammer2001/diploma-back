import {Injectable} from '@nestjs/common';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {PublicationGetListRequest} from '../types/request/publication-get-list.request';
import {PublicationGetRepoRequest} from '../../../data-layer/repositories/publication/repo-request/publication-get.repo-request';
import {PublicationDbModel} from '../../../data-layer/db-models/publication.db-model';
import {PublicationResponse} from '../types/response/publication.response';
import {PublicationGetByIdRequest} from '../types/request/publication-get-by-id.request';
import {PublicationCreateRequest} from '../types/request/publication-create.request';
import {PublicationCreateRepoRequest} from '../../../data-layer/repositories/publication/repo-request/publication-create.repo-request';
import {PublicationUpdateRequest} from '../types/request/publication-update.request';
import {PublicationUpdateRepoRequest} from '../../../data-layer/repositories/publication/repo-request/publication-update.repo-request';
import {PublicationDeleteRepoRequest} from '../../../data-layer/repositories/publication/repo-request/publication-delete.repo-request';
import {UserGetRepoRequest} from '../../../data-layer/repositories/user/repo-request/user-get.repo-request';
import {UserSelectFieldsEnum} from '../../../data-layer/repositories/user/enums/user-select-fields.enum';

@Injectable()
export class PublicationMapper {
  getPublicationListRequestToRepoRequest(source: PublicationGetListRequest): PublicationGetRepoRequest {
    const destination = new PublicationGetRepoRequest();

    destination.userIds = source.userIds;
    destination.publisher = source.publisher;
    destination.dateMore = source.dateMore;
    destination.dateLess = source.dateLess;
    destination.showDeleted = source.showDeleted;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  publicationPaginatorDbModelToResponse(source: IPaginator<PublicationDbModel>): IPaginator<PublicationResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.publicationDbModelToResponse(el))
    };
  }

  publicationDbModelToResponse(source: PublicationDbModel): PublicationResponse {
    const destination = new PublicationResponse();

    destination.id = source.id;
    destination.publisher = source.publisher;
    destination.url = source.url;
    destination.anotherAuthors = source.anotherAuthors;
    destination.date = source.date?.toISOString().split('T')[0];
    destination.description = source.description;
    destination.title = source.title;
    destination.isDeleted = source.isDeleted;
    destination.guid = source.guid;

    if (source.users) {
      destination.users = source.users.map(el => ({
        id: el.id,
        name: el.fullName
      }));
    }

    return destination;
  }

  getPublicationByIdRequestToRepoRequest(source: PublicationGetByIdRequest): PublicationGetRepoRequest {
    const destination = new PublicationGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  initializeGetPublicationByIdRepoRequest(id: number, select: Array<string>): PublicationGetRepoRequest {
    const destination = new PublicationGetRepoRequest();

    destination.id = id;
    destination.select = select;
    destination.showDeleted = true;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createPublicationRequestToRepoRequest(source: PublicationCreateRequest): PublicationCreateRepoRequest {
    const destination = new PublicationCreateRepoRequest();

    destination.url = source.url;
    destination.publisher = source.publisher;
    destination.date = source.date;
    destination.description = source.description;
    destination.title = source.title;
    destination.anotherAuthors = source.anotherAuthors;
    destination.userIds = source.userIds;

    return destination;
  }

  initializeGetUsersRepoRequest(userIds: Array<number>): UserGetRepoRequest {
    const destination = new UserGetRepoRequest();

    destination.ids = userIds;
    destination.select = [UserSelectFieldsEnum.ID, UserSelectFieldsEnum.IS_DELETED];
    destination.size = userIds.length;
    destination.showDeleted = true;

    return destination;
  }

  updatePublicationRequestToRepoRequest(source: PublicationUpdateRequest): PublicationUpdateRepoRequest {
    const destination = new PublicationUpdateRepoRequest();

    destination.id = source.id;
    destination.url = source.url;
    destination.publisher = source.publisher;
    destination.date = source.date;
    destination.description = source.description;
    destination.title = source.title;
    destination.userIds = source.userIds;
    destination.anotherAuthors = source.anotherAuthors;

    return destination;
  }

  deletePublicationRequestToRepoRequest(id: number): PublicationDeleteRepoRequest {
    const destination = new PublicationDeleteRepoRequest();

    destination.id = id;

    return destination;
  }
}
