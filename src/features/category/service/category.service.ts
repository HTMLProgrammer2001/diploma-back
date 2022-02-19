import {Injectable, Logger} from '@nestjs/common';
import {CategoryMapper} from '../mapper/category.mapper';
import {CategoryGetListRequest} from '../types/request/category-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {CategoryResponse} from '../types/response/category.response';
import {CategoryGetByIdRequest} from '../types/request/category-get-by-id.request';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {CategoryCreateRequest} from '../types/request/category-create.request';
import {CategoryUpdateRequest} from '../types/request/category-update.request';
import {IdResponse} from '../../../global/types/response/id.response';
import {CategoryRepository} from '../../../data-layer/repositories/category/category.repository';
import {CategorySelectFieldsEnum} from '../../../data-layer/repositories/category/enums/category-select-fields.enum';

@Injectable()
export class CategoryService {
  private logger: Logger;

  constructor(
    private categoryRepository: CategoryRepository,
    private categoryMapper: CategoryMapper,
  ) {
    this.logger = new Logger(CategoryService.name);
  }

  async getCategoryList(request: CategoryGetListRequest): Promise<IPaginator<CategoryResponse>> {
    try {
      const repoRequest = this.categoryMapper.getCategoryListRequestToRepoRequest(request);
      const {data} = await this.categoryRepository.getCategories(repoRequest);
      return this.categoryMapper.categoryPaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getCategoryById(request: CategoryGetByIdRequest): Promise<CategoryResponse> {
    try {
      const repoRequest = this.categoryMapper.getCategoryByIdRequestToRepoRequest(request);
      const {data} = await this.categoryRepository.getCategories(repoRequest);

      if (data.responseList?.length) {
        return this.categoryMapper.categoryDbModelToResponse(data.responseList[0]);
      } else {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Category with id ${request.id} not exist`
        });
      }
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async createCategory(request: CategoryCreateRequest): Promise<CategoryResponse> {
    try {
      const createRepoRequest = this.categoryMapper.createCategoryRequestToRepoRequest(request);
      const {createdID} = await this.categoryRepository.createCategory(createRepoRequest);

      const repoRequest = this.categoryMapper.initializeCategoryGetByIdRepoRequest(createdID, request.select);
      const {data} = await this.categoryRepository.getCategories(repoRequest);
      return this.categoryMapper.categoryDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateCategory(request: CategoryUpdateRequest): Promise<CategoryResponse> {
    try {
      const getCurrentCategoryRepoRequest = this.categoryMapper.initializeCategoryGetByIdRepoRequest(
        request.id,
        [CategorySelectFieldsEnum.GUID, CategorySelectFieldsEnum.IS_DELETED]
      );

      const currentCategory = await this.categoryRepository.getCategories(getCurrentCategoryRepoRequest);

      if (!currentCategory.data.responseList?.length) {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Category with id ${request.id} not exist`
        });
      } else if (currentCategory.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Category with id ${request.id} is deleted`
        });
      } else if (currentCategory.data.responseList[0].guid !== request.guid) {
        throw new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Category guid was changed'});
      }

      const updateRepoRequest = this.categoryMapper.updateCategoryRequestToRepoRequest(request);
      const {updatedID} = await this.categoryRepository.updateCategory(updateRepoRequest);

      const repoRequest = this.categoryMapper.initializeCategoryGetByIdRepoRequest(updatedID, request.select);
      const {data} = await this.categoryRepository.getCategories(repoRequest);
      return this.categoryMapper.categoryDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deleteCategory(id: number, guid: string): Promise<IdResponse> {
    try {
      const getCurrentCategoryRepoRequest = this.categoryMapper.initializeCategoryGetByIdRepoRequest(
        id, [CategorySelectFieldsEnum.GUID, CategorySelectFieldsEnum.IS_DELETED]
      );

      const currentCategory = await this.categoryRepository.getCategories(getCurrentCategoryRepoRequest);

      if (!currentCategory.data.responseList?.length) {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Category with id ${id} not exist`});
      } else if (currentCategory.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Category with id ${id} already deleted`
        });
      } else if (currentCategory.data.responseList[0].guid !== guid) {
        throw new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Category guid was changed`});
      }

      const deleteRepoRequest = this.categoryMapper.deleteCategoryRequestToRepoRequest(id);
      const {deletedID} = await this.categoryRepository.deleteCategory(deleteRepoRequest);

      return {id: deletedID};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }
}
