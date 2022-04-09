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
import {HonorCreateRepoRequest} from './repo-request/honor-create.repo-request';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {HonorDeleteRepoRequest} from './repo-request/honor-delete.repo-request';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {HonorUpdateRepoRequest} from './repo-request/honor-update.repo-request';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {HonorDbModel, HonorInterface} from '../../db-models/honor.db-model';
import {TeacherDbModel} from '../../db-models/teacher.db-model';
import {HonorImportData} from '../../../features/import/types/common/import-data/honor-import-data';

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

          case HonorSelectFieldsEnum.TEACHER_ID:
            if (!includes.teacher)
              includes.teacher = {model: TeacherDbModel, attributes: ['id']}
            else
              (includes.teacher.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case HonorSelectFieldsEnum.TEACHER_NAME:
            if (!includes.teacher)
              includes.teacher = {model: TeacherDbModel, attributes: ['fullName']}
            else
              (includes.teacher.attributes as Array<string | ProjectionAlias>).push('fullName');
            break;
        }
      });

      //endregion

      //region Filters

      const filters: WhereOptions<HonorInterface> = {};

      if (repoRequest.title) {
        filters.title = {[Op.like]: `%${repoRequest.title || ''}%`};
      }

      if (repoRequest.orderNumber) {
        filters.orderNumber = {[Op.like]: `%${repoRequest.orderNumber || ''}%`};
      }

      if (!isNil(repoRequest.orderNumberEqual)) {
        filters.orderNumber = repoRequest.orderNumberEqual;
      }

      if (!isNil(repoRequest.orderNumberIn)) {
        filters.orderNumber = {[Op.in]: repoRequest.orderNumberIn};
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

      if (!isNil(repoRequest.teacherIds)) {
        filters.teacherId = {[Op.in]: repoRequest.teacherIds};
      }

      if (!isNil(repoRequest.teacherId)) {
        filters.teacherId = repoRequest.teacherId;
      }

      if (!repoRequest.showInActive) {
        filters.isActive = true;
      }

      if (!repoRequest.showDeleted) {
        if (repoRequest.showCascadeDeletedBy) {
          filters[Op.or] = {isDeleted: false, cascadeDeletedBy: repoRequest.showCascadeDeletedBy};
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
          case HonorOrderFieldsEnum.ID:
            order.push(['id', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case HonorOrderFieldsEnum.TITLE:
            order.push(['title', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case HonorOrderFieldsEnum.DATE:
            order.push(['date', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case HonorOrderFieldsEnum.ORDER_NUMBER:
            order.push(['orderNumber', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case HonorOrderFieldsEnum.TEACHER:
            includes.teacher = includes.teacher ?? {model: TeacherDbModel, attributes: []};
            order.push([{model: TeacherDbModel, as: 'teacher'}, 'fullName', repoRequest.isDesc ? 'DESC' : 'ASC']);
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

  async updateHonor(repoRequest: HonorUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    const updateData = {} as HonorInterface;

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

  async import(data: Array<HonorImportData>, ignoreErrors: boolean): Promise<void> {
    try {
      await this.honorDbModel.bulkCreate(data.map(el => ({
        teacherId: el.teacherId,
        isActive: el.isActive,
        description: el.description,
        orderNumber: el.orderNumber,
        date: el.date,
        title: el.title
      })), {ignoreDuplicates: ignoreErrors})
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }
}
