import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {isNil} from 'lodash';
import {RoleGetRepoRequest} from './repo-request/role-get.repo-request';
import {Op} from 'sequelize';
import {FindAttributeOptions, WhereOptions} from 'sequelize/dist/lib/model';
import {RoleSelectFieldsEnum} from './enums/role-select-fields.enum';
import {RoleGetRepoResponse} from './repo-response/role-get.repo-response';
import {convertFindAndCountToPaginator} from '../../../common/utils/functions';
import {RoleDbModel} from '../../db-models/role.db-model';

@Injectable()
export class RoleRepository {
  constructor(@InjectModel(RoleDbModel) private roleDbModel: typeof RoleDbModel) {}

  async getRoles(repoRequest: RoleGetRepoRequest): Promise<RoleGetRepoResponse> {
    repoRequest.page = repoRequest.page ?? 1;
    repoRequest.size = repoRequest.size ?? 5;

    //region Select

    const attributes: FindAttributeOptions = [];

    if(!repoRequest) {
      repoRequest.select = [RoleSelectFieldsEnum.ID, RoleSelectFieldsEnum.NAME];
    }

    repoRequest.select.forEach(field => {
      switch (field) {
        case RoleSelectFieldsEnum.ID:
          attributes.push('id');
          break;

        case RoleSelectFieldsEnum.NAME:
          attributes.push('name');
          break;
      }
    });

    //endregion

    //region Filters

    const filters: WhereOptions = {};

    if(!isNil(repoRequest.name)) {
      filters.name = {[Op.like]: `%${repoRequest.name || ''}%`};
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

    const data = await this.roleDbModel.findAndCountAll({
      where: filters,
      order,
      attributes,
      offset: (repoRequest.page - 1) * repoRequest.size,
      limit: repoRequest.size
    });

    return {data: convertFindAndCountToPaginator(data, repoRequest.page, repoRequest.size)};
  }
}
