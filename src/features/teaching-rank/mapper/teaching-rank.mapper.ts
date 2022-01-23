import {Injectable} from '@nestjs/common';
import {TeachingRankGetListRequest} from '../types/request/teaching-rank-get-list.request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {TeachingRankResponse} from '../types/response/teaching-rank.response';
import {TeachingRankGetByIdRequest} from '../types/request/teaching-rank-get-by-id.request';
import {TeachingRankCreateRequest} from '../types/request/teaching-rank-create.request';
import {TeachingRankUpdateRequest} from '../types/request/teaching-rank-update.request';
import {TeachingRankGetRepoRequest} from '../../../data-layer/repositories/teaching-rank/repo-request/teaching-rank-get.repo-request';
import {TeachingRankDbModel} from '../../../data-layer/db-models/teaching-rank.db-model';
import {TeachingRankCreateRepoRequest} from '../../../data-layer/repositories/teaching-rank/repo-request/teaching-rank-create.repo-request';
import {TeachingRankDeleteRepoRequest} from '../../../data-layer/repositories/teaching-rank/repo-request/teaching-rank-delete.repo-request';
import {TeachingRankUpdateRepoRequest} from '../../../data-layer/repositories/teaching-rank/repo-request/teaching-rank-update.repo-request';

@Injectable()
export class TeachingRankMapper {
  getTeachingRankListRequestToRepoRequest(source: TeachingRankGetListRequest): TeachingRankGetRepoRequest {
    const destination = new TeachingRankGetRepoRequest();

    destination.name = source.name;
    destination.showDeleted = source.showDeleted;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  teachingRankPaginatorDbModelToResponse(source: IPaginator<TeachingRankDbModel>): IPaginator<TeachingRankResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.teachingRankDbModelToResponse(el))
    };
  }

  teachingRankDbModelToResponse(source: TeachingRankDbModel): TeachingRankResponse {
    const destination = new TeachingRankResponse();

    destination.id = source.id;
    destination.name = source.name;
    destination.guid = source.guid;
    destination.isDeleted = source.isDeleted;

    return destination;
  }

  getTeachingRankByIdRequestToRepoRequest(source: TeachingRankGetByIdRequest): TeachingRankGetRepoRequest {
    const destination = new TeachingRankGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createTeachingRankRequestToRepoRequest(source: TeachingRankCreateRequest): TeachingRankCreateRepoRequest {
    const destination = new TeachingRankCreateRepoRequest();

    destination.name = source.name;

    return destination;
  }

  deleteTeachingRankRequestToRepoRequest(id: number): TeachingRankDeleteRepoRequest {
    const destination = new TeachingRankDeleteRepoRequest();

    destination.id = id;

    return destination;
  }

  updateTeachingRankRequestToRepoRequest(request: TeachingRankUpdateRequest): TeachingRankUpdateRepoRequest {
    const destination = new TeachingRankUpdateRepoRequest();

    destination.id = request.id;
    destination.name = request.name;

    return destination;
  }
}
