import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {CommissionDbModel} from '../../db-models/commission.db-model';
import {isEmpty, isNil, isUndefined} from 'lodash';
import {CommissionGetRepoRequest} from './repo-request/commission-get.repo-request';
import sequelize, {Op} from 'sequelize';
import {FindAttributeOptions, WhereOptions} from 'sequelize/dist/lib/model';
import {CommissionSelectFieldsEnum} from './enums/commission-select-fields.enum';
import {CommissionGetRepoResponse} from './repo-response/commission-get.repo-response';
import {convertFindAndCountToPaginator} from '../../../common/utils/functions';
import {CommissionCreateRepoRequest} from './repo-request/commission-create.repo-request';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {CommissionDeleteRepoRequest} from './repo-request/commission-delete.repo-request';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {CommissionUpdateRepoRequest} from './repo-request/commission-update.repo-request';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {Model} from 'sequelize-typescript';

@Injectable()
export class CommissionRepository {
  constructor(@InjectModel(CommissionDbModel) private commissionModel: typeof CommissionDbModel) {}

  async getCommissions(repoRequest: CommissionGetRepoRequest): Promise<CommissionGetRepoResponse> {
    repoRequest.page = repoRequest.page ?? 1;
    repoRequest.size = repoRequest.size ?? 5;

    //region Select

    const attributes: FindAttributeOptions = [];

    if(!repoRequest) {
      repoRequest.select = [CommissionSelectFieldsEnum.ID, CommissionSelectFieldsEnum.NAME];
    }

    repoRequest.select.forEach(field => {
      switch (field) {
        case CommissionSelectFieldsEnum.ID:
          attributes.push('id');
          break;

        case CommissionSelectFieldsEnum.NAME:
          attributes.push('name');
          break;

        case CommissionSelectFieldsEnum.IS_DELETED:
          attributes.push('isDeleted');
          break;

        case CommissionSelectFieldsEnum.GUID:
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

    const data = await this.commissionModel.findAndCountAll({
      where: filters,
      order,
      attributes,
      offset: (repoRequest.page - 1) * repoRequest.size,
      limit: repoRequest.size
    });

    return {data: convertFindAndCountToPaginator(data, repoRequest.page, repoRequest.size)};
  }

  async createCommission(repoRequest: CommissionCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    const {id} = await this.commissionModel.create({name: repoRequest.name});
    return {createdID: id};
  }

  async updateCommission(repoRequest: CommissionUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    const updateData = {} as Omit<CommissionDbModel, keyof Model>;

    if(!isUndefined(repoRequest.name)) {
      updateData.name = repoRequest.name;
    }

    if(!isEmpty(updateData)) {
      updateData.guid = sequelize.literal('UUID()') as any;
      await this.commissionModel.update(updateData, {where: {id: repoRequest.id}});
    }

    return {updatedID: repoRequest.id};
  }

  async deleteCommission(repoRequest: CommissionDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    await this.commissionModel.update({isDeleted: true}, {where: {id: repoRequest.id}});
    return {deletedID: repoRequest.id};
  }
}
