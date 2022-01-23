import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {CommissionDbModel} from '../../db-models/commission.db-model';
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

@Injectable()
export class DepartmentRepository {
  constructor(@InjectModel(DepartmentDbModel) private departmentDbModel: typeof DepartmentDbModel) {}

  async getDepartments(repoRequest: DepartmentGetRepoRequest): Promise<DepartmentGetRepoResponse> {
    repoRequest.page = repoRequest.page ?? 1;
    repoRequest.size = repoRequest.size ?? 5;

    //region Select

    const attributes: FindAttributeOptions = [];

    if(!repoRequest) {
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

    if(!isNil(repoRequest.name)) {
      filters.name = {[Op.like]: `%${repoRequest.name || ''}%`};
    }

    if(!repoRequest.showDeleted) {
      filters.isDeleted = false;
    }

    if(!isNil(repoRequest.id)) {
      filters.id = repoRequest.id;
    }

    if(!isNil(repoRequest.ids)) {
      filters.id = {[Op.in]: repoRequest.ids};
    }

    //endregion

    //region Sorting

    const order = [];

    if(repoRequest.orderField) {
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
  }

  async createDepartment(repoRequest: DepartmentCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    const {id} = await this.departmentDbModel.create({name: repoRequest.name});
    return {createdID: id};
  }

  async updateDepartment(repoRequest: DepartmentUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    const updateData = {} as Omit<CommissionDbModel, keyof Model>;

    if(!isUndefined(repoRequest.name)) {
      updateData.name = repoRequest.name;
    }

    if(!isEmpty(updateData)) {
      updateData.guid = sequelize.literal('UUID()') as any;
      await this.departmentDbModel.update(updateData, {where: {id: repoRequest.id}});
    }

    return {updatedID: repoRequest.id};
  }

  async deleteDepartment(repoRequest: DepartmentDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    await this.departmentDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}});
    return {deletedID: repoRequest.id};
  }
}
