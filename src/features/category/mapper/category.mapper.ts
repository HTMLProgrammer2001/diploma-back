import {Injectable} from '@nestjs/common';
import {CategoryGetListRequest} from '../types/request/category-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {CategoryResponse} from '../types/response/category.response';
import {CategoryGetByIdRequest} from '../types/request/category-get-by-id.request';
import {AcademicDegreeGetRepoRequest} from '../../../data-layer/repositories/academic-degree/repo-request/academic-degree-get.repo-request';
import {AcademicDegreeDbModel} from '../../../data-layer/db-models/academic-degree.db-model';
import {CategoryCreateRequest} from '../types/request/category-create.request';
import {AcademicDegreeCreateRepoRequest} from '../../../data-layer/repositories/academic-degree/repo-request/academic-degree-create.repo-request';
import {CategoryUpdateRequest} from '../types/request/category-update.request';
import {AcademicDegreeUpdateRepoRequest} from '../../../data-layer/repositories/academic-degree/repo-request/academic-degree-update.repo-request';
import {AcademicDegreeDeleteRepoRequest} from '../../../data-layer/repositories/academic-degree/repo-request/academic-degree-delete.repo-request';
import {CategoryGetRepoRequest} from '../../../data-layer/repositories/category/repo-request/category-get.repo-request';
import {CategoryDbModel} from '../../../data-layer/db-models/category.db-model';
import {CategoryCreateRepoRequest} from '../../../data-layer/repositories/category/repo-request/category-create.repo-request';
import {CategoryUpdateRepoRequest} from '../../../data-layer/repositories/category/repo-request/category-update.repo-request';
import {CategoryDeleteRepoRequest} from '../../../data-layer/repositories/category/repo-request/category-delete.repo-request';

@Injectable()
export class CategoryMapper {
  getCategoryListRequestToRepoRequest(source: CategoryGetListRequest): CategoryGetRepoRequest {
    const destination = new CategoryGetRepoRequest();

    destination.name = source.name;
    destination.showDeleted = source.showDeleted;
    destination.orderField = source.orderField;
    destination.isDesc = !!source.isDesc;
    destination.select = [...source.select];
    destination.page = source.page;
    destination.size = source.size;

    return destination;
  }

  categoryPaginatorDbModelToResponse(source: IPaginator<CategoryDbModel>): IPaginator<CategoryResponse> {
    return {
      ...source,
      responseList: source.responseList.map(el => this.categoryDbModelToResponse(el))
    };
  }

  categoryDbModelToResponse(source: CategoryDbModel): CategoryResponse {
    const destination = new CategoryResponse();

    destination.id = source.id;
    destination.name = source.name;
    destination.guid = source.guid;
    destination.isDeleted = source.isDeleted;

    return destination;
  }

  getCategoryByIdRequestToRepoRequest(source: CategoryGetByIdRequest): CategoryGetRepoRequest {
    const destination = new CategoryGetRepoRequest();

    destination.id = source.id;
    destination.select = source.select;
    destination.showDeleted = source.showDeleted;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  createCategoryRequestToRepoRequest(source: CategoryCreateRequest): CategoryCreateRepoRequest {
    const destination = new CategoryCreateRepoRequest();

    destination.name = source.name;

    return destination;
  }

  initializeCategoryGetByIdRepoRequest(id: number, select: Array<string>): CategoryGetRepoRequest {
    const destination = new CategoryGetRepoRequest();

    destination.id = id
    destination.select = select;
    destination.showDeleted = true;
    destination.page = 1;
    destination.size = 1;

    return destination;
  }

  updateCategoryRequestToRepoRequest(source: CategoryUpdateRequest): CategoryUpdateRepoRequest {
    const destination = new CategoryUpdateRepoRequest();

    destination.id = source.id;
    destination.name = source.name;

    return destination;
  }

  deleteCategoryRequestToRepoRequest(id: number): CategoryDeleteRepoRequest {
    const destination = new CategoryDeleteRepoRequest();

    destination.id = id;

    return destination;
  }
}
