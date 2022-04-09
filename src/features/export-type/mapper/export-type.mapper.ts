import {Injectable} from '@nestjs/common';
import {ExportTypeGetListRequest} from '../types/request/export-type-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {ExportTypeResponse} from '../types/response/export-type.response';
import {ExportTypeGetByIdRequest} from '../types/request/export-type-get-by-id.request';
import {ExportTypeGetRepoRequest} from '../../../data-layer/repositories/export-type/repo-request/export-type-get.repo-request';
import {ExportTypeDbModel} from '../../../data-layer/db-models/export-type.db-model';

@Injectable()
export class ExportTypeMapper {
  getExportTypeListRequestToRepoRequest(source: ExportTypeGetListRequest): ExportTypeGetRepoRequest {
    const destination = new ExportTypeGetRepoRequest();

    destination.name = source.name;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  exportTypePaginatorDbModelToResponse(source: IPaginator<ExportTypeDbModel>): IPaginator<ExportTypeResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.exportTypeDbModelToResponse(el))
    };
  }

  exportTypeDbModelToResponse(source: ExportTypeDbModel): ExportTypeResponse {
    const destination = new ExportTypeResponse();

    destination.id = source.id;
    destination.name = source.name;

    return destination;
  }

  getExportTypeByIdRequestToRepoRequest(source: ExportTypeGetByIdRequest): ExportTypeGetRepoRequest {
    const destination = new ExportTypeGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }
}
