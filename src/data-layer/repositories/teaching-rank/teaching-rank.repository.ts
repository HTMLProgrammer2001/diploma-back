import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {isNil} from 'lodash';
import {TeachingRankGetRepoRequest} from './repo-request/teaching-rank-get.repo-request';
import {Op} from 'sequelize';
import {FindAttributeOptions, WhereOptions} from 'sequelize/dist/lib/model';
import {TeachingRankSelectFieldsEnum} from './enums/teaching-rank-select-fields.enum';
import {TeachingRankGetRepoResponse} from './repo-response/teaching-rank-get.repo-response';
import {convertFindAndCountToPaginator} from '../../../common/utils/functions';
import {TeachingRankDbModel} from '../../db-models/teaching-rank.db-model';

@Injectable()
export class TeachingRankRepository {
  constructor(@InjectModel(TeachingRankDbModel) private teachingRankDbModel: typeof TeachingRankDbModel) {}

  async getTeachingRanks(repoRequest: TeachingRankGetRepoRequest): Promise<TeachingRankGetRepoResponse> {
    repoRequest.page = repoRequest.page ?? 1;
    repoRequest.size = repoRequest.size ?? 5;

    //region Select

    const attributes: FindAttributeOptions = [];

    if(!repoRequest) {
      repoRequest.select = [TeachingRankSelectFieldsEnum.ID, TeachingRankSelectFieldsEnum.NAME];
    }

    repoRequest.select.forEach(field => {
      switch (field) {
        case TeachingRankSelectFieldsEnum.ID:
          attributes.push('id');
          break;

        case TeachingRankSelectFieldsEnum.NAME:
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

    const data = await this.teachingRankDbModel.findAndCountAll({
      where: filters,
      order,
      attributes,
      offset: (repoRequest.page - 1) * repoRequest.size,
      limit: repoRequest.size
    });

    return {data: convertFindAndCountToPaginator(data, repoRequest.page, repoRequest.size)};
  }
}
