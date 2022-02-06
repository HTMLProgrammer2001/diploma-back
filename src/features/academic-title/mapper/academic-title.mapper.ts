import {Injectable} from '@nestjs/common';
import {AcademicTitleGetListRequest} from '../types/request/academic-title-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {AcademicTitleResponse} from '../types/response/academic-title.response';
import {AcademicTitleGetByIdRequest} from '../types/request/academic-title-get-by-id.request';
import {AcademicTitleGetRepoRequest} from '../../../data-layer/repositories/academic-title/repo-request/academic-title-get.repo-request';
import {AcademicTitleDbModel} from '../../../data-layer/db-models/academic-title.db-model';
import {AcademicTitleCreateRequest} from '../types/request/academic-title-create.request';
import {AcademicTitleCreateRepoRequest} from '../../../data-layer/repositories/academic-title/repo-request/academic-title-create.repo-request';
import {AcademicTitleUpdateRequest} from '../types/request/academic-title-update.request';
import {AcademicTitleUpdateRepoRequest} from '../../../data-layer/repositories/academic-title/repo-request/academic-title-update.repo-request';
import {AcademicTitleDeleteRepoRequest} from '../../../data-layer/repositories/academic-title/repo-request/academic-title-delete.repo-request';

@Injectable()
export class AcademicTitleMapper {
  getAcademicTitleListRequestToRepoRequest(source: AcademicTitleGetListRequest): AcademicTitleGetRepoRequest {
    const destination = new AcademicTitleGetRepoRequest();

    destination.name = source.name;
    destination.showDeleted = source.showDeleted;
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
    destination.isDeleted = source.isDeleted;
    destination.guid = source.guid;

    return destination;
  }

  getAcademicTitleByIdRequestToRepoRequest(source: AcademicTitleGetByIdRequest): AcademicTitleGetRepoRequest {
    const destination = new AcademicTitleGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  initializeAcademicTitleGetByIdRepoRequest(id: number, select: Array<string>): AcademicTitleGetRepoRequest {
    const destination = new AcademicTitleGetRepoRequest();

    destination.id = id;
    destination.select = select;
    destination.showDeleted = true;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createAcademicTitleRequestToRepoRequest(source: AcademicTitleCreateRequest): AcademicTitleCreateRepoRequest {
    const destination = new AcademicTitleCreateRepoRequest();

    destination.name = source.name;

    return destination;
  }

  updateAcademicTitleRequestToRepoRequest(source: AcademicTitleUpdateRequest): AcademicTitleUpdateRepoRequest {
    const destination = new AcademicTitleUpdateRepoRequest();

    destination.name = source.name;
    destination.id = source.id;

    return destination;
  }

  deleteAcademicTitleRequestToRepoRequest(id: number): AcademicTitleDeleteRepoRequest {
    const destination = new AcademicTitleDeleteRepoRequest();

    destination.id = id;

    return destination;
  }
}
