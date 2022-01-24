import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {isNil} from 'lodash';
import {AcademicDegreeGetRepoRequest} from './repo-request/academic-degree-get.repo-request';
import {Op} from 'sequelize';
import {FindAttributeOptions, WhereOptions} from 'sequelize/dist/lib/model';
import {AcademicDegreeSelectFieldsEnum} from './enums/academic-degree-select-fields.enum';
import {AcademicDegreeGetRepoResponse} from './repo-response/academic-degree-get.repo-response';
import {convertFindAndCountToPaginator} from '../../../common/utils/functions';
import {AcademicDegreeDbModel} from '../../db-models/academic-degree.db-model';

@Injectable()
export class AcademicDegreeRepository {
  constructor(@InjectModel(AcademicDegreeDbModel) private academicDegreeDbModel: typeof AcademicDegreeDbModel) {}

  async getAcademicDegree(repoRequest: AcademicDegreeGetRepoRequest): Promise<AcademicDegreeGetRepoResponse> {
    repoRequest.page = repoRequest.page ?? 1;
    repoRequest.size = repoRequest.size ?? 5;

    //region Select

    const attributes: FindAttributeOptions = [];

    if(!repoRequest) {
      repoRequest.select = [AcademicDegreeSelectFieldsEnum.ID, AcademicDegreeSelectFieldsEnum.NAME];
    }

    repoRequest.select.forEach(field => {
      switch (field) {
        case AcademicDegreeSelectFieldsEnum.ID:
          attributes.push('id');
          break;

        case AcademicDegreeSelectFieldsEnum.NAME:
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

    const data = await this.academicDegreeDbModel.findAndCountAll({
      where: filters,
      order,
      attributes,
      offset: (repoRequest.page - 1) * repoRequest.size,
      limit: repoRequest.size
    });

    return {data: convertFindAndCountToPaginator(data, repoRequest.page, repoRequest.size)};
  }
}
