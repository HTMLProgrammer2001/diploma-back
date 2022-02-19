import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {isEmpty, isNil, isUndefined} from 'lodash';
import sequelize, {Op} from 'sequelize';
import {FindAttributeOptions, IncludeOptions, ProjectionAlias, WhereOptions} from 'sequelize/dist/lib/model';
import {convertFindAndCountToPaginator} from '../../../global/utils/functions';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {CategoryDbModel, CategoryInterface} from '../../db-models/category.db-model';
import {CategoryGetRepoRequest} from './repo-request/category-get.repo-request';
import {CategoryGetRepoResponse} from './repo-response/category-get.repo-response';
import {CategorySelectFieldsEnum} from './enums/category-select-fields.enum';
import {CategoryCreateRepoRequest} from './repo-request/category-create.repo-request';
import {CategoryUpdateRepoRequest} from './repo-request/category-update.repo-request';
import {CategoryDeleteRepoRequest} from './repo-request/category-delete.repo-request';
import {AttestationCascadeDeleteByEnum, AttestationDbModel} from '../../db-models/attestation.db-model';
import {Sequelize} from 'sequelize-typescript';

@Injectable()
export class CategoryRepository {
  private logger: Logger;

  constructor(
    @InjectModel(CategoryDbModel) private categoryDbModel: typeof CategoryDbModel,
    @InjectModel(AttestationDbModel) private attestationDbModel: typeof AttestationDbModel,
    private sequelize: Sequelize
  ) {
    this.logger = new Logger(CategoryRepository.name);
  }

  async getCategories(repoRequest: CategoryGetRepoRequest): Promise<CategoryGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      //region Select

      const attributes: FindAttributeOptions = [];
      const includes: Record<string, IncludeOptions> = {};

      if (!repoRequest) {
        repoRequest.select = [CategorySelectFieldsEnum.ID, CategorySelectFieldsEnum.NAME];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case CategorySelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case CategorySelectFieldsEnum.NAME:
            attributes.push('name');
            break;

          case CategorySelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case CategorySelectFieldsEnum.GUID:
            attributes.push('guid');
            break;

          case CategorySelectFieldsEnum.ATTESTATIONS_ID:
            if (!includes.attestations)
              includes.attestations = {model: AttestationDbModel, attributes: ['id']}
            else
              (includes.attestations.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case CategorySelectFieldsEnum.ATTESTATIONS_GUID:
            if (!includes.attestations)
              includes.attestations = {model: AttestationDbModel, attributes: ['guid']}
            else
              (includes.attestations.attributes as Array<string | ProjectionAlias>).push('guid');
            break;
        }
      });

      //endregion

      //region Filters

      const filters: WhereOptions<CategoryInterface> = {};

      if (!isNil(repoRequest.name)) {
        filters.name = {[Op.like]: `%${repoRequest.name || ''}%`};
      }

      if (!isNil(repoRequest.ids)) {
        filters.id = {[Op.in]: repoRequest.ids};
      }

      if (!isNil(repoRequest.id)) {
        filters.id = repoRequest.id;
      }

      if (!repoRequest.showDeleted) {
        filters.isDeleted = false;
      }

      //endregion

      //region Sorting

      const order = [];

      if (repoRequest.orderField) {
        order.push([repoRequest.orderField, repoRequest.isDesc ? 'DESC' : 'ASC']);
      }

      //endregion

      const data = await this.categoryDbModel.findAndCountAll({
        where: filters,
        order,
        attributes,
        include: Object.values(includes),
        offset: (repoRequest.page - 1) * repoRequest.size,
        limit: repoRequest.size
      });

      return {data: convertFindAndCountToPaginator(data, repoRequest.page, repoRequest.size)};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async createCategory(repoRequest: CategoryCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.categoryDbModel.create({name: repoRequest.name});
      return {createdID: id};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async updateCategory(repoRequest: CategoryUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    try {
      const updateData = {} as CategoryInterface;

      if (!isUndefined(repoRequest.name)) {
        updateData.name = repoRequest.name;
      }

      if (!isEmpty(updateData)) {
        updateData.guid = sequelize.literal('UUID()') as any;
        await this.categoryDbModel.update(updateData, {where: {id: repoRequest.id}});
      }

      return {updatedID: repoRequest.id};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async deleteCategory(repoRequest: CategoryDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.sequelize.transaction({autocommit: true}, t => {
        return this.categoryDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}, transaction: t})
          .then(() => this.attestationDbModel.update(
            {isDeleted: true, cascadeDeletedBy: AttestationCascadeDeleteByEnum.CATEGORY},
            {where: {categoryId: repoRequest.id, isDeleted: false}, transaction: t}
          ));
      });
      return {deletedID: repoRequest.id};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }
}
