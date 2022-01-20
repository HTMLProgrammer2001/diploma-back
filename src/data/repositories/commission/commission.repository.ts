import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {CommissionDbModel} from '../../db-models/commission.db-model';
import {isEmpty, isNil, isUndefined} from 'lodash';
import {GetCommissionListRepoRequest} from './repo-request/get-commission-list.repo-request';
import sequelize, {Op} from 'sequelize';
import {FindAttributeOptions, WhereOptions} from 'sequelize/dist/lib/model';
import {CommissionSelectFieldsEnum} from './enums/commission-select-fields.enum';
import {GetCommissionListRepoResponse} from './repo-response/get-commission-list.repo-response';
import {convertFindAndCountToPaginator} from '../../../common/utils/functions';
import {CreateCommissionRepoRequest} from './repo-request/create-commission.repo-request';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {DeleteCommissionRepoRequest} from './repo-request/delete-commission.repo-request';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {UpdateCommissionRepoRequest} from './repo-request/update-commission.repo-request';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {Model} from 'sequelize-typescript';

@Injectable()
export class CommissionRepository {
  constructor(@InjectModel(CommissionDbModel) private commissionModel: typeof CommissionDbModel) {}

  async getCommissionList(repoRequest: GetCommissionListRepoRequest): Promise<GetCommissionListRepoResponse> {
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

  async createCommission(repoRequest: CreateCommissionRepoRequest): Promise<CommonCreateRepoResponse> {
    const {id} = await this.commissionModel.create({name: repoRequest.name});
    return {createdID: id};
  }

  async updateCommission(repoRequest: UpdateCommissionRepoRequest): Promise<CommonUpdateRepoResponse> {
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

  async deleteCommission(repoRequest: DeleteCommissionRepoRequest): Promise<CommonDeleteRepoResponse> {
    await this.commissionModel.update({isDeleted: true}, {where: {id: repoRequest.id}});
    return {deletedID: repoRequest.id};
  }
}
