import {Injectable} from '@nestjs/common';
import {ImportTypeGetListRequest} from '../types/request/import-type-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {ImportTypeResponse} from '../types/response/import-type.response';
import {ImportTypeGetByIdRequest} from '../types/request/import-type-get-by-id.request';
import {ImportTypeGetRepoRequest} from '../../../data-layer/repositories/import-type/repo-request/import-type-get.repo-request';
import {ImportTypeDbModel} from '../../../data-layer/db-models/import-type.db-model';

@Injectable()
export class ImportTypeMapper {
  getImportTypeListRequestToRepoRequest(source: ImportTypeGetListRequest): ImportTypeGetRepoRequest {
    const destination = new ImportTypeGetRepoRequest();

    destination.name = source.name;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  importTypePaginatorDbModelToResponse(source: IPaginator<ImportTypeDbModel>): IPaginator<ImportTypeResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.importTypeDbModelToResponse(el))
    };
  }

  importTypeDbModelToResponse(source: ImportTypeDbModel): ImportTypeResponse {
    const destination = new ImportTypeResponse();

    destination.id = source.id;
    destination.name = source.name;

    return destination;
  }

  getImportTypeByIdRequestToRepoRequest(source: ImportTypeGetByIdRequest): ImportTypeGetRepoRequest {
    const destination = new ImportTypeGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }
}
