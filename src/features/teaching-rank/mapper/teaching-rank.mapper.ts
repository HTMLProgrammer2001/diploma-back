import {Injectable} from '@nestjs/common';
import {TeachingRankGetListRequest} from '../types/request/teaching-rank-get-list.request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {TeachingRankResponse} from '../types/response/teaching-rank.response';
import {TeachingRankGetByIdRequest} from '../types/request/teaching-rank-get-by-id.request';
import {TeachingRankGetRepoRequest} from '../../../data-layer/repositories/teaching-rank/repo-request/teaching-rank-get.repo-request';
import {TeachingRankDbModel} from '../../../data-layer/db-models/teaching-rank.db-model';

@Injectable()
export class TeachingRankMapper {
  getTeachingRankListRequestToRepoRequest(source: TeachingRankGetListRequest): TeachingRankGetRepoRequest {
    const destination = new TeachingRankGetRepoRequest();

    destination.name = source.name;
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

    return destination;
  }

  getTeachingRankByIdRequestToRepoRequest(source: TeachingRankGetByIdRequest): TeachingRankGetRepoRequest {
    const destination = new TeachingRankGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }
}
