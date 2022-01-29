import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {isEmpty, isNil, isUndefined} from 'lodash';
import {DepartmentGetRepoRequest} from './repo-request/department-get.repo-request';
import sequelize, {Op} from 'sequelize';
import {FindAttributeOptions, WhereOptions} from 'sequelize/dist/lib/model';
import {DepartmentSelectFieldsEnum} from './enums/department-select-fields.enum';
import {DepartmentGetRepoResponse} from './repo-response/department-get.repo-response';
import {convertFindAndCountToPaginator} from '../../../common/utils/functions';
import {DepartmentCreateRepoRequest} from './repo-request/department-create.repo-request';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {DepartmentDeleteRepoRequest} from './repo-request/department-delete.repo-request';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {DepartmentUpdateRepoRequest} from './repo-request/department-update.repo-request';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {Model} from 'sequelize-typescript';
import {DepartmentDbModel} from '../../db-models/department.db-model';
import {CustomError} from '../../../common/class/custom-error';
import {ErrorCodesEnum} from '../../../common/constants/error-codes.enum';

@Injectable()
export class DepartmentRepository {
  private logger: Logger;

  constructor(@InjectModel(DepartmentDbModel) private departmentDbModel: typeof DepartmentDbModel) {
    this.logger = new Logger(DepartmentRepository.name);
  }

  async getDepartments(repoRequest: DepartmentGetRepoRequest): Promise<DepartmentGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
        repoRequest.select = [DepartmentSelectFieldsEnum.ID, DepartmentSelectFieldsEnum.NAME];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case DepartmentSelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case DepartmentSelectFieldsEnum.NAME:
            attributes.push('name');
            break;

          case DepartmentSelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case DepartmentSelectFieldsEnum.GUID:
            attributes.push('guid');
            break;
        }
      });

      //endregion

      //region Filters

      const filters: WhereOptions = {};

      if (!isNil(repoRequest.name)) {
        filters.name = {[Op.like]: `%${repoRequest.name || ''}%`};
      }

      if (!repoRequest.showDeleted) {
        filters.isDeleted = false;
      }

      if (!isNil(repoRequest.id)) {
        filters.id = repoRequest.id;
      }

      if (!isNil(repoRequest.ids)) {
        filters.id = {[Op.in]: repoRequest.ids};
      }

      //endregion

      //region Sorting

      const order = [];

      if (repoRequest.orderField) {
        order.push([repoRequest.orderField, repoRequest.isDesc ? 'DESC' : 'ASC']);
      }

      //endregion

      const data = await this.departmentDbModel.findAndCountAll({
        where: filters,
        order,
        attributes,
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

  async createDepartment(repoRequest: DepartmentCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.departmentDbModel.create({name: repoRequest.name});
      return {createdID: id};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async updateDepartment(repoRequest: DepartmentUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    try {
      const updateData = {} as Omit<DepartmentDbModel, keyof Model>;

      if (!isUndefined(repoRequest.name)) {
        updateData.name = repoRequest.name;
      }

      if (!isEmpty(updateData)) {
        updateData.guid = sequelize.literal('UUID()') as any;
        await this.departmentDbModel.update(updateData, {where: {id: repoRequest.id}});
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

  async deleteDepartment(repoRequest: DepartmentDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.departmentDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}});
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
