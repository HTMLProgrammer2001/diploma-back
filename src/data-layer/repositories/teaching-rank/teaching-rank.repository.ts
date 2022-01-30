import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {isEmpty, isNil, isUndefined} from 'lodash';
import {TeachingRankGetRepoRequest} from './repo-request/teaching-rank-get.repo-request';
import sequelize, {Op} from 'sequelize';
import {FindAttributeOptions, WhereOptions} from 'sequelize/dist/lib/model';
import {TeachingRankSelectFieldsEnum} from './enums/teaching-rank-select-fields.enum';
import {TeachingRankGetRepoResponse} from './repo-response/teaching-rank-get.repo-response';
import {convertFindAndCountToPaginator} from '../../../global/utils/functions';
import {TeachingRankDbModel} from '../../db-models/teaching-rank.db-model';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {Model} from 'sequelize-typescript';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {TeachingRankDeleteRepoRequest} from './repo-request/teaching-rank-delete.repo-request';
import {TeachingRankCreateRepoRequest} from './repo-request/teaching-rank-create.repo-request';
import {TeachingRankUpdateRepoRequest} from './repo-request/teaching-rank-update.repo-request';

@Injectable()
export class TeachingRankRepository {
  private logger: Logger;

  constructor(@InjectModel(TeachingRankDbModel) private teachingRankDbModel: typeof TeachingRankDbModel) {
    this.logger = new Logger(TeachingRankRepository.name);
  }

  async getTeachingRanks(repoRequest: TeachingRankGetRepoRequest): Promise<TeachingRankGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
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

          case TeachingRankSelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case TeachingRankSelectFieldsEnum.GUID:
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

      if(!repoRequest.showDeleted) {
        filters.isDeleted = false;
      }

      //endregion

      //region Sorting

      const order = [];

      if (repoRequest.orderField) {
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
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async createTeachingRank(repoRequest: TeachingRankCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.teachingRankDbModel.create({name: repoRequest.name});
      return {createdID: id};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async updateTeachingRank(repoRequest: TeachingRankUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    try {
      const updateData = {} as Omit<TeachingRankDbModel, keyof Model>;

      if (!isUndefined(repoRequest.name)) {
        updateData.name = repoRequest.name;
      }

      if (!isEmpty(updateData)) {
        updateData.guid = sequelize.literal('UUID()') as any;
        await this.teachingRankDbModel.update(updateData, {where: {id: repoRequest.id}});
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

  async deleteTeachingRank(repoRequest: TeachingRankDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.teachingRankDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}});
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
