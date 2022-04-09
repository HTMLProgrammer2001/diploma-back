import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {isNil} from 'lodash';
import {ExportTypeGetRepoRequest} from './repo-request/export-type-get.repo-request';
import {Op} from 'sequelize';
import {FindAttributeOptions, WhereOptions} from 'sequelize/dist/lib/model';
import {ExportTypeSelectFieldsEnum} from './enums/export-type-select-fields.enum';
import {ImportTypeGetRepoResponse} from './repo-response/import-type-get.repo-response';
import {convertFindAndCountToPaginator} from '../../../global/utils/functions';
import {RoleInterface} from '../../db-models/role.db-model';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {ExportTypeDbModel} from '../../db-models/export-type.db-model';

@Injectable()
export class ExportTypeRepository {
  private logger: Logger;

  constructor(@InjectModel(ExportTypeDbModel) private exportTypeDbModel: typeof ExportTypeDbModel) {
    this.logger = new Logger(ExportTypeRepository.name);
  }

  async getExportTypes(repoRequest: ExportTypeGetRepoRequest): Promise<ImportTypeGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
        repoRequest.select = [ExportTypeSelectFieldsEnum.ID, ExportTypeSelectFieldsEnum.NAME];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case ExportTypeSelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case ExportTypeSelectFieldsEnum.NAME:
            attributes.push('name');
            break;
        }
      });

      //endregion

      //region Filters

      const filters: WhereOptions<RoleInterface> = {};

      if (!isNil(repoRequest.name)) {
        filters.name = {[Op.like]: `%${repoRequest.name || ''}%`};
      }

      if (!isNil(repoRequest.ids)) {
        filters.id = {[Op.in]: repoRequest.ids};
      }

      if (!isNil(repoRequest.id)) {
        filters.id = repoRequest.id;
      }

      //endregion

      //region Sorting

      const order = [];

      if (repoRequest.orderField) {
        order.push([repoRequest.orderField, repoRequest.isDesc ? 'DESC' : 'ASC']);
      }

      //endregion

      const data = await this.exportTypeDbModel.findAndCountAll({
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
}
