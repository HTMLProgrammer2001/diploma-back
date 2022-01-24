import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {isNil} from 'lodash';
import {AcademicTitleGetRepoRequest} from './repo-request/academic-title-get.repo-request';
import {Op} from 'sequelize';
import {FindAttributeOptions, WhereOptions} from 'sequelize/dist/lib/model';
import {AcademicTitleSelectFieldsEnum} from './enums/academic-title-select-fields.enum';
import {AcademicTitleGetRepoResponse} from './repo-response/academic-title-get.repo-response';
import {convertFindAndCountToPaginator} from '../../../common/utils/functions';
import {AcademicTitleDbModel} from '../../db-models/academic-title.db-model';

@Injectable()
export class AcademicTitleRepository {
  constructor(@InjectModel(AcademicTitleDbModel) private academicTitleDbModel: typeof AcademicTitleDbModel) {}

  async getAcademicTitle(repoRequest: AcademicTitleGetRepoRequest): Promise<AcademicTitleGetRepoResponse> {
    repoRequest.page = repoRequest.page ?? 1;
    repoRequest.size = repoRequest.size ?? 5;

    //region Select

    const attributes: FindAttributeOptions = [];

    if(!repoRequest) {
      repoRequest.select = [AcademicTitleSelectFieldsEnum.ID, AcademicTitleSelectFieldsEnum.NAME];
    }

    repoRequest.select.forEach(field => {
      switch (field) {
        case AcademicTitleSelectFieldsEnum.ID:
          attributes.push('id');
          break;

        case AcademicTitleSelectFieldsEnum.NAME:
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

    const data = await this.academicTitleDbModel.findAndCountAll({
      where: filters,
      order,
      attributes,
      offset: (repoRequest.page - 1) * repoRequest.size,
      limit: repoRequest.size
    });

    return {data: convertFindAndCountToPaginator(data, repoRequest.page, repoRequest.size)};
  }
}
