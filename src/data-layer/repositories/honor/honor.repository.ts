import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {HonorGetRepoRequest} from './repo-request/honor-get.repo-request';
import {HonorGetRepoResponse} from './repo-response/honor-get.repo-response';
import {FindAttributeOptions, IncludeOptions, ProjectionAlias} from 'sequelize/dist/lib/model';
import {HonorSelectFieldsEnum} from './enums/honor-select-fields.enum';
import sequelize, {Op, WhereOptions} from 'sequelize';
import {isEmpty, isNil, isUndefined} from 'lodash';
import {convertFindAndCountToPaginator} from '../../../global/utils/functions';
import {HonorOrderFieldsEnum} from './enums/honor-order-fields.enum';
import {DepartmentDbModel} from '../../db-models/department.db-model';
import {HonorCreateRepoRequest} from './repo-request/honor-create.repo-request';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {HonorDeleteRepoRequest} from './repo-request/honor-delete.repo-request';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {HonorUpdateRepoRequest} from './repo-request/honor-update.repo-request';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {Model} from 'sequelize-typescript';
import {HonorDbModel} from '../../db-models/honor.db-model';
import {UserDbModel} from '../../db-models/user.db-model';

@Injectable()
export class HonorRepository {
  private logger: Logger;

  constructor(@InjectModel(HonorDbModel) private honorDbModel: typeof HonorDbModel) {
    this.logger = new Logger(HonorRepository.name);
  }

  async getHonors(repoRequest: HonorGetRepoRequest): Promise<HonorGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      const includes: Record<string, IncludeOptions> = {};

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
        repoRequest.select = [HonorSelectFieldsEnum.ID, HonorSelectFieldsEnum.TITLE];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case HonorSelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case HonorSelectFieldsEnum.TITLE:
            attributes.push('title');
            break;

          case HonorSelectFieldsEnum.DATE:
            attributes.push('date');
            break;

          case HonorSelectFieldsEnum.DESCRIPTION:
            attributes.push('description');
            break;

          case HonorSelectFieldsEnum.ORDER_NUMBER:
            attributes.push('orderNumber');
            break;

          case HonorSelectFieldsEnum.IS_ACTIVE:
            attributes.push('isActive');
            break;

          case HonorSelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case HonorSelectFieldsEnum.GUID:
            attributes.push('guid');
            break;

          case HonorSelectFieldsEnum.USER_ID:
            if (!includes.user)
              includes.user = {model: UserDbModel, attributes: ['id']}
            else
              (includes.user.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case HonorSelectFieldsEnum.USER_NAME:
            if (!includes.user)
              includes.user = {model: UserDbModel, attributes: ['fullName']}
            else
              (includes.user.attributes as Array<string | ProjectionAlias>).push('fullName');
            break;
        }
      });

      //endregion

      //region Filters

      const filters: WhereOptions = {};

      if (!isNil(repoRequest.title)) {
        filters.title = {[Op.like]: `%${repoRequest.title || ''}%`};
      }

      if (!isNil(repoRequest.orderNumber)) {
        filters.orderNumber = {[Op.like]: `%${repoRequest.orderNumber || ''}%`};
      }

      if (!isNil(repoRequest.dateMore)) {
        filters.date = {[Op.gte]: repoRequest.dateMore};
      }

      if (!isNil(repoRequest.dateLess)) {
        filters.date = {[Op.lte]: repoRequest.dateLess};
      }

      if (!isNil(repoRequest.userId)) {
        filters.userId = repoRequest.userId;
      }

      if (!repoRequest.showInActive) {
        filters.isActive = true;
      }

      if (!repoRequest.showDeleted) {
        filters.isDeleted = false;
      }

      if (!isNil(repoRequest.id)) {
        filters.id = repoRequest.id;
      }

      if (!isNil(repoRequest.ids)) {
        filters.id = {[Op.in]: repoRequest.ids};
      }

      //endregion

      //region Sorting

      const order = [];

      if (!isNil(repoRequest.orderField)) {
        switch (repoRequest.orderField) {
          case HonorOrderFieldsEnum.ID:
            order.push(['id', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case HonorOrderFieldsEnum.TITLE:
            order.push(['title', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case HonorOrderFieldsEnum.DATE:
            order.push(['date', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case HonorOrderFieldsEnum.USER:
            includes.user = includes.user ?? {model: DepartmentDbModel, attributes: []};
            order.push([UserDbModel, 'fullName', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;
        }
      } else {
        order.push(['id', 'ASC']);
      }

      //endregion

      const data = await this.honorDbModel.findAndCountAll({
        where: filters,
        order,
        attributes,
        offset: (repoRequest.page - 1) * repoRequest.size,
        limit: repoRequest.size,
        include: Object.values(includes)
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

  async createHonor(repoRequest: HonorCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.honorDbModel.create({
        title: repoRequest.title,
        date: repoRequest.date,
        description: repoRequest.description,
        orderNumber: repoRequest.orderNumber,
        userId: repoRequest.userId,
        isActive: repoRequest.isActive
      });
      return {createdID: id};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async updateHonor(repoRequest: HonorUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    const updateData = {} as Omit<HonorDbModel, keyof Model>;

    if (!isUndefined(repoRequest.title)) {
      updateData.title = repoRequest.title;
    }

    if (!isUndefined(repoRequest.date)) {
      updateData.date = repoRequest.date;
    }

    if (!isUndefined(repoRequest.userId)) {
      updateData.userId = repoRequest.userId;
    }

    if (!isUndefined(repoRequest.orderNumber)) {
      updateData.orderNumber = repoRequest.orderNumber;
    }

    if (!isUndefined(repoRequest.description)) {
      updateData.description = repoRequest.description;
    }

    if (!isUndefined(repoRequest.isActive)) {
      updateData.isActive = repoRequest.isActive;
    }

    if (!isEmpty(updateData)) {
      updateData.guid = sequelize.literal('UUID()') as any;
      await this.honorDbModel.update(updateData, {where: {id: repoRequest.id}});
    }

    return {updatedID: repoRequest.id};
  }

  async deleteHonor(repoRequest: HonorDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.honorDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}});
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
