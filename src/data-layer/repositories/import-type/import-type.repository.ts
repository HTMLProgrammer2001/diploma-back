import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {isEmpty, isNil, isUndefined} from 'lodash';
import {ImportTypeGetRepoRequest} from './repo-request/import-type-get.repo-request';
import sequelize, {Op} from 'sequelize';
import {FindAttributeOptions, WhereOptions} from 'sequelize/dist/lib/model';
import {ImportTypeSelectFieldsEnum} from './enums/import-type-select-fields.enum';
import {ImportTypeGetRepoResponse} from './repo-response/import-type-get.repo-response';
import {convertFindAndCountToPaginator} from '../../../global/utils/functions';
import {RoleInterface} from '../../db-models/role.db-model';
import {ImportTypeUpdateRepoRequest} from './repo-request/import-type-update.repo-request';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {ImportTypeDbModel} from '../../db-models/import-type.db-model';

@Injectable()
export class ImportTypeRepository {
  private logger: Logger;

  constructor(@InjectModel(ImportTypeDbModel) private importTypeDbModel: typeof ImportTypeDbModel) {
    this.logger = new Logger(ImportTypeRepository.name);
  }

  async updateImportType(repoRequest: ImportTypeUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    try {
      const updateData = {} as RoleInterface;

      if (!isUndefined(repoRequest.name)) {
        updateData.name = repoRequest.name;
      }

      if (!isEmpty(updateData)) {
        updateData.guid = sequelize.literal('UUID()') as any;
        await this.importTypeDbModel.update(updateData, {where: {id: repoRequest.id}});
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

  async getImportTypes(repoRequest: ImportTypeGetRepoRequest): Promise<ImportTypeGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
        repoRequest.select = [ImportTypeSelectFieldsEnum.ID, ImportTypeSelectFieldsEnum.NAME];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case ImportTypeSelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case ImportTypeSelectFieldsEnum.NAME:
            attributes.push('name');
            break;

          case ImportTypeSelectFieldsEnum.GUID:
            attributes.push('guid');
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

      const data = await this.importTypeDbModel.findAndCountAll({
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
