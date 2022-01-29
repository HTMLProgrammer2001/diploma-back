import {Injectable} from '@nestjs/common';
import {AcademicDegreeGetListRequest} from '../types/request/academic-degree-get-list.request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {AcademicDegreeResponse} from '../types/response/academic-degree.response';
import {AcademicDegreeGetByIdRequest} from '../types/request/academic-degree-get-by-id.request';
import {TeachingRankGetRepoRequest} from '../../../data-layer/repositories/teaching-rank/repo-request/teaching-rank-get.repo-request';
import {AcademicDegreeGetRepoRequest} from '../../../data-layer/repositories/academic-degree/repo-request/academic-degree-get.repo-request';
import {AcademicDegreeDbModel} from '../../../data-layer/db-models/academic-degree.db-model';
import {AcademicDegreeCreateRequest} from '../types/request/academic-degree-create.request';
import {AcademicDegreeCreateRepoRequest} from '../../../data-layer/repositories/academic-degree/repo-request/academic-degree-create.repo-request';
import {AcademicDegreeUpdateRequest} from '../types/request/academic-degree-update.request';
import {AcademicDegreeUpdateRepoRequest} from '../../../data-layer/repositories/academic-degree/repo-request/academic-degree-update.repo-request';
import {AcademicDegreeDeleteRepoRequest} from '../../../data-layer/repositories/academic-degree/repo-request/academic-degree-delete.repo-request';

@Injectable()
export class AcademicDegreeMapper {
  getAcademicDegreeListRequestToRepoRequest(source: AcademicDegreeGetListRequest): AcademicDegreeGetRepoRequest {
    const destination = new AcademicDegreeGetRepoRequest();

    destination.name = source.name;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  academicDegreePaginatorDbModelToResponse(source: IPaginator<AcademicDegreeDbModel>): IPaginator<AcademicDegreeResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.academicDegreeDbModelToResponse(el))
    };
  }

  academicDegreeDbModelToResponse(source: AcademicDegreeDbModel): AcademicDegreeResponse {
    const destination = new AcademicDegreeResponse();

    destination.id = source.id;
    destination.name = source.name;
    destination.guid = source.guid;
    destination.isDeleted = source.isDeleted;

    return destination;
  }

  getAcademicDegreeByIdRequestToRepoRequest(source: AcademicDegreeGetByIdRequest): AcademicDegreeGetRepoRequest {
    const destination = new AcademicDegreeGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createAcademicDegreeRequestToRepoRequest(source: AcademicDegreeCreateRequest): AcademicDegreeCreateRepoRequest {
    const destination = new AcademicDegreeCreateRepoRequest();

    destination.name = source.name;

    return destination;
  }

  initializeAcademicDegreeGetByIdRepoRequest(id: number, select: Array<string>): AcademicDegreeGetRepoRequest {
    const destination = new AcademicDegreeGetRepoRequest();

    destination.id = id
    destination.select = select;
    destination.showDeleted = true;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  updateAcademicDegreeRequestToRepoRequest(source: AcademicDegreeUpdateRequest): AcademicDegreeUpdateRepoRequest {
    const destination = new AcademicDegreeUpdateRepoRequest();

    destination.id = source.id;
    destination.name = source.name;

    return destination;
  }

  deleteAcademicDegreeRequestToRepoRequest(id: number): AcademicDegreeDeleteRepoRequest {
    const destination = new AcademicDegreeDeleteRepoRequest();

    destination.id = id;

    return destination;
  }
}
