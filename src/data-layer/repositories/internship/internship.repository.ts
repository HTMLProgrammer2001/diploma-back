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
import {Model} from 'sequelize-typescript';
import {UserDbModel} from '../../db-models/user.db-model';
import {InternshipDbModel} from '../../db-models/internship.db-model';
import {InternshipGetRepoRequest} from './repo-request/internship-get.repo-request';
import {InternshipGetRepoResponse} from './repo-response/internship-get.repo-response';
import {InternshipSelectFieldsEnum} from './enums/internship-select-fields.enum';
import {InternshipOrderFieldsEnum} from './enums/internship-order-fields.enum';
import {InternshipCreateRepoRequest} from './repo-request/internship-create.repo-request';
import {InternshipUpdateRepoRequest} from './repo-request/internship-update.repo-request';
import {InternshipDeleteRepoRequest} from './repo-request/internship-delete.repo-request';

@Injectable()
export class InternshipRepository {
  private logger: Logger;

  constructor(@InjectModel(InternshipDbModel) private internshipDbModel: typeof InternshipDbModel) {
    this.logger = new Logger(InternshipRepository.name);
  }

  async getInternships(repoRequest: InternshipGetRepoRequest): Promise<InternshipGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      const includes: Record<string, IncludeOptions> = {};

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
        repoRequest.select = [InternshipSelectFieldsEnum.ID, InternshipSelectFieldsEnum.TITLE];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case InternshipSelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case InternshipSelectFieldsEnum.TITLE:
            attributes.push('title');
            break;

          case InternshipSelectFieldsEnum.FROM:
            attributes.push('from');
            break;

          case InternshipSelectFieldsEnum.TO:
            attributes.push('to');
            break;

          case InternshipSelectFieldsEnum.DESCRIPTION:
            attributes.push('description');
            break;

          case InternshipSelectFieldsEnum.CODE:
            attributes.push('code');
            break;

          case InternshipSelectFieldsEnum.HOURS:
            attributes.push('hours');
            break;

          case InternshipSelectFieldsEnum.CREDITS:
            attributes.push('credits');
            break;

          case InternshipSelectFieldsEnum.PLACE:
            attributes.push('place');
            break;

          case InternshipSelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case InternshipSelectFieldsEnum.GUID:
            attributes.push('guid');
            break;

          case InternshipSelectFieldsEnum.USER_ID:
            if (!includes.user)
              includes.user = {model: UserDbModel, attributes: ['id']}
            else
              (includes.user.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case InternshipSelectFieldsEnum.USER_NAME:
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

      if (!isNil(repoRequest.code)) {
        filters.orderNumber = {[Op.like]: `%${repoRequest.code || ''}%`};
      }

      if (!isNil(repoRequest.codeEqual)) {
        filters.code = repoRequest.codeEqual;
      }

      if (!isNil(repoRequest.place)) {
        filters.place = {[Op.like]: `%${repoRequest.place || ''}%`};
      }

      if (!isNil(repoRequest.dateFromMore)) {
        filters.from = {[Op.gte]: repoRequest.dateFromMore};
      }

      if (!isNil(repoRequest.dateToLess)) {
        filters.to = {[Op.lte]: repoRequest.dateToLess};
      }

      if (!isNil(repoRequest.userId)) {
        filters.userId = repoRequest.userId;
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
          case InternshipOrderFieldsEnum.ID:
            order.push(['id', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case InternshipOrderFieldsEnum.TITLE:
            order.push(['title', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case InternshipOrderFieldsEnum.DATE_FROM:
            order.push(['from', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case InternshipOrderFieldsEnum.DATE_TO:
            order.push(['from', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case InternshipOrderFieldsEnum.USER:
            includes.user = includes.user ?? {model: UserDbModel, attributes: []};
            order.push([{model: UserDbModel, as: 'user'}, 'fullName', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;
        }
      } else {
        order.push(['id', 'ASC']);
      }

      //endregion

      const data = await this.internshipDbModel.findAndCountAll({
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

  async createInternship(repoRequest: InternshipCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.internshipDbModel.create({
        title: repoRequest.title,
        from: repoRequest.from,
        to: repoRequest.to,
        description: repoRequest.description,
        code: repoRequest.code,
        place: repoRequest.place,
        credits: repoRequest.credits,
        hours: repoRequest.hours,
        userId: repoRequest.userId,
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

  async updateInternship(repoRequest: InternshipUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    const updateData = {} as Omit<InternshipDbModel, keyof Model>;

    if (!isUndefined(repoRequest.title)) {
      updateData.title = repoRequest.title;
    }

    if (!isUndefined(repoRequest.from)) {
      updateData.from = repoRequest.from;
    }

    if (!isUndefined(repoRequest.to)) {
      updateData.to = repoRequest.to;
    }

    if (!isUndefined(repoRequest.code)) {
      updateData.code = repoRequest.code;
    }

    if (!isUndefined(repoRequest.credits)) {
      updateData.credits = repoRequest.credits;
    }

    if (!isUndefined(repoRequest.hours)) {
      updateData.hours = repoRequest.hours;
    }

    if (!isUndefined(repoRequest.description)) {
      updateData.description = repoRequest.description;
    }

    if (!isUndefined(repoRequest.place)) {
      updateData.place = repoRequest.place;
    }

    if (!isUndefined(repoRequest.userId)) {
      updateData.userId = repoRequest.userId;
    }

    if (!isEmpty(updateData)) {
      updateData.guid = sequelize.literal('UUID()') as any;
      await this.internshipDbModel.update(updateData, {where: {id: repoRequest.id}});
    }

    return {updatedID: repoRequest.id};
  }

  async deleteInternship(repoRequest: InternshipDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.internshipDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}});
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
