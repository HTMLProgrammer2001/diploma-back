import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {FindAttributeOptions, IncludeOptions, ProjectionAlias} from 'sequelize/dist/lib/model';
import sequelize, {Op, WhereOptions} from 'sequelize';
import {isEmpty, isNil, isUndefined} from 'lodash';
import {convertFindAndCountToPaginator} from '../../../global/utils/functions';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {RebukeDbModel, RebukeInterface} from '../../db-models/rebuke.db-model';
import {RebukeGetRepoRequest} from './repo-request/rebuke-get.repo-request';
import {RebukeGetRepoResponse} from './repo-response/rebuke-get.repo-response';
import {RebukeSelectFieldsEnum} from './enums/rebuke-select-fields.enum';
import {RebukeOrderFieldsEnum} from './enums/rebuke-order-fields.enum';
import {RebukeCreateRepoRequest} from './repo-request/rebuke-create.repo-request';
import {RebukeUpdateRepoRequest} from './repo-request/rebuke-update.repo-request';
import {RebukeDeleteRepoRequest} from './repo-request/rebuke-delete.repo-request';
import {TeacherDbModel} from '../../db-models/teacher.db-model';

@Injectable()
export class RebukeRepository {
  private logger: Logger;

  constructor(@InjectModel(RebukeDbModel) private rebukeDbModel: typeof RebukeDbModel) {
    this.logger = new Logger(RebukeRepository.name);
  }

  async getRebukes(repoRequest: RebukeGetRepoRequest): Promise<RebukeGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      const includes: Record<string, IncludeOptions> = {};

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
        repoRequest.select = [RebukeSelectFieldsEnum.ID, RebukeSelectFieldsEnum.TITLE];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case RebukeSelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case RebukeSelectFieldsEnum.TITLE:
            attributes.push('title');
            break;

          case RebukeSelectFieldsEnum.DATE:
            attributes.push('date');
            break;

          case RebukeSelectFieldsEnum.DESCRIPTION:
            attributes.push('description');
            break;

          case RebukeSelectFieldsEnum.ORDER_NUMBER:
            attributes.push('orderNumber');
            break;

          case RebukeSelectFieldsEnum.IS_ACTIVE:
            attributes.push('isActive');
            break;

          case RebukeSelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case RebukeSelectFieldsEnum.GUID:
            attributes.push('guid');
            break;

          case RebukeSelectFieldsEnum.TEACHER_ID:
            if (!includes.teacher)
              includes.teacher = {model: TeacherDbModel, attributes: ['id']}
            else
              (includes.teacher.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case RebukeSelectFieldsEnum.TEACHER_NAME:
            if (!includes.teacher)
              includes.teacher = {model: TeacherDbModel, attributes: ['fullName']}
            else
              (includes.teacher.attributes as Array<string | ProjectionAlias>).push('fullName');
            break;
        }
      });

      //endregion

      //region Filters

      const filters: WhereOptions<RebukeInterface> = {};

      if (!isNil(repoRequest.title)) {
        filters.title = {[Op.like]: `%${repoRequest.title || ''}%`};
      }

      if (!isNil(repoRequest.orderNumber)) {
        filters.orderNumber = {[Op.like]: `%${repoRequest.orderNumber || ''}%`};
      }

      if (!isNil(repoRequest.orderNumberEqual)) {
        filters.orderNumber = repoRequest.orderNumberEqual;
      }

      if (!isNil(repoRequest.dateMore)) {
        filters.date = {[Op.gte]: repoRequest.dateMore};
      }

      if (!isNil(repoRequest.dateLess)) {
        if (!filters.date) {
          filters.date = {[Op.lte]: repoRequest.dateLess};
        } else {
          filters.date[Op.lte] = repoRequest.dateLess;
        }
      }

      if (!isNil(repoRequest.teacherId)) {
        filters.teacherId = repoRequest.teacherId;
      }

      if (!repoRequest.showInActive) {
        filters.isActive = true;
      }

      if (!repoRequest.showDeleted) {
        if (repoRequest.showCascadeDeletedBy) {
          filters[Op.or] = {isDeleted: false, isCascadeDelete: true};
        } else {
          filters.isDeleted = false;
        }
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

      if (!isNil(repoRequest.orderField)) {
        switch (repoRequest.orderField) {
          case RebukeOrderFieldsEnum.ID:
            order.push(['id', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case RebukeOrderFieldsEnum.TITLE:
            order.push(['title', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case RebukeOrderFieldsEnum.DATE:
            order.push(['date', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case RebukeOrderFieldsEnum.TEACHER:
            includes.teacher = includes.teacher ?? {model: TeacherDbModel, attributes: []};
            order.push([{model: TeacherDbModel, as: 'teacher'}, 'fullName', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;
        }
      } else {
        order.push(['id', 'ASC']);
      }

      //endregion

      const data = await this.rebukeDbModel.findAndCountAll({
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

  async createRebuke(repoRequest: RebukeCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.rebukeDbModel.create({
        title: repoRequest.title,
        date: repoRequest.date,
        description: repoRequest.description,
        orderNumber: repoRequest.orderNumber,
        teacherId: repoRequest.teacherId,
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

  async updateRebuke(repoRequest: RebukeUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    const updateData = {} as RebukeInterface;

    if (!isUndefined(repoRequest.title)) {
      updateData.title = repoRequest.title;
    }

    if (!isUndefined(repoRequest.date)) {
      updateData.date = repoRequest.date;
    }

    if (!isUndefined(repoRequest.teacherId)) {
      updateData.teacherId = repoRequest.teacherId;
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
      await this.rebukeDbModel.update(updateData, {where: {id: repoRequest.id}});
    }

    return {updatedID: repoRequest.id};
  }

  async deleteRebuke(repoRequest: RebukeDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.rebukeDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}});
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
