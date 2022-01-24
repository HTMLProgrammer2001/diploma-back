import {Injectable} from '@nestjs/common';
import {AcademicTitleGetListRequest} from '../types/request/academic-title-get-list.request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {AcademicTitleResponse} from '../types/response/academic-title.response';
import {AcademicTitleGetByIdRequest} from '../types/request/academic-title-get-by-id.request';
import {TeachingRankGetRepoRequest} from '../../../data-layer/repositories/teaching-rank/repo-request/teaching-rank-get.repo-request';
import {AcademicDegreeGetRepoRequest} from '../../../data-layer/repositories/academic-degree/repo-request/academic-degree-get.repo-request';
import {AcademicDegreeDbModel} from '../../../data-layer/db-models/academic-degree.db-model';
import {AcademicTitleGetRepoRequest} from '../../../data-layer/repositories/academic-title/repo-request/academic-title-get.repo-request';
import {AcademicTitleDbModel} from '../../../data-layer/db-models/academic-title.db-model';

@Injectable()
export class AcademicTitleMapper {
  getAcademicTitleListRequestToRepoRequest(source: AcademicTitleGetListRequest): AcademicTitleGetRepoRequest {
    const destination = new AcademicTitleGetRepoRequest();

    destination.name = source.name;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  academicTitlePaginatorDbModelToResponse(source: IPaginator<AcademicTitleDbModel>): IPaginator<AcademicTitleResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.academicTitleDbModelToResponse(el))
    };
  }

  academicTitleDbModelToResponse(source: AcademicTitleDbModel): AcademicTitleResponse {
    const destination = new AcademicTitleResponse();

    destination.id = source.id;
    destination.name = source.name;

    return destination;
  }

  getAcademicTitleByIdRequestToRepoRequest(source: AcademicTitleGetByIdRequest): AcademicTitleGetRepoRequest {
    const destination = new AcademicTitleGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }
}
