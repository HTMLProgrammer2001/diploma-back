import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {isEmpty, isNil, isUndefined} from 'lodash';
import {AcademicTitleGetRepoRequest} from './repo-request/academic-title-get.repo-request';
import sequelize, {Op} from 'sequelize';
import {FindAttributeOptions, WhereOptions} from 'sequelize/dist/lib/model';
import {AcademicTitleSelectFieldsEnum} from './enums/academic-title-select-fields.enum';
import {AcademicTitleGetRepoResponse} from './repo-response/academic-title-get.repo-response';
import {convertFindAndCountToPaginator} from '../../../global/utils/functions';
import {AcademicTitleDbModel} from '../../db-models/academic-title.db-model';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {Model} from 'sequelize-typescript';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {AcademicTitleCreateRepoRequest} from './repo-request/academic-title-create.repo-request';
import {AcademicTitleUpdateRepoRequest} from './repo-request/academic-title-update.repo-request';
import {AcademicTitleDeleteRepoRequest} from './repo-request/academic-title-delete.repo-request';

@Injectable()
export class AcademicTitleRepository {
  private logger: Logger;

  constructor(@InjectModel(AcademicTitleDbModel) private academicTitleDbModel: typeof AcademicTitleDbModel) {
    this.logger = new Logger();
  }

  async getAcademicTitle(repoRequest: AcademicTitleGetRepoRequest): Promise<AcademicTitleGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
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

          case AcademicTitleSelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case AcademicTitleSelectFieldsEnum.GUID:
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

      if (!isNil(repoRequest.id)) {
        filters.id = repoRequest.id;
      }

      if (!isNil(repoRequest.ids)) {
        filters.id = {[Op.in]: repoRequest.ids};
      }

      if (!repoRequest.showDeleted) {
        filters.isDeleted = false;
      }

      //endregion

      //region Sorting

      const order = [];

      if (repoRequest.orderField) {
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
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async createAcademicTitle(repoRequest: AcademicTitleCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.academicTitleDbModel.create({name: repoRequest.name});
      return {createdID: id};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async updateAcademicTitle(repoRequest: AcademicTitleUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    try {
      const updateData = {} as Omit<AcademicTitleDbModel, keyof Model>;

      if (!isUndefined(repoRequest.name)) {
        updateData.name = repoRequest.name;
      }

      if (!isEmpty(updateData)) {
        updateData.guid = sequelize.literal('UUID()') as any;
        await this.academicTitleDbModel.update(updateData, {where: {id: repoRequest.id}});
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

  async deleteAcademicTitle(repoRequest: AcademicTitleDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.academicTitleDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}});
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
