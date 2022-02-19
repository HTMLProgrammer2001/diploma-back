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
import {AttestationGetRepoRequest} from './repo-request/attestation-get.repo-request';
import {AttestationGetRepoResponse} from './repo-response/attestation-get.repo-response';
import {AttestationSelectFieldsEnum} from './enums/attestation-select-fields.enum';
import {AttestationOrderFieldsEnum} from './enums/attestation-order-fields.enum';
import {AttestationCreateRepoRequest} from './repo-request/attestation-create.repo-request';
import {AttestationUpdateRepoRequest} from './repo-request/attestation-update.repo-request';
import {AttestationDeleteRepoRequest} from './repo-request/attestation-delete.repo-request';
import {AttestationDbModel, AttestationInterface} from '../../db-models/attestation.db-model';
import {CategoryDbModel} from '../../db-models/category.db-model';
import {TeacherDbModel} from '../../db-models/teacher.db-model';

@Injectable()
export class AttestationRepository {
  private logger: Logger;

  constructor(@InjectModel(AttestationDbModel) private attestationDbModel: typeof AttestationDbModel) {
    this.logger = new Logger(AttestationRepository.name);
  }

  async getAttestations(repoRequest: AttestationGetRepoRequest): Promise<AttestationGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      const includes: Record<string, IncludeOptions> = {};

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
        repoRequest.select = [AttestationSelectFieldsEnum.ID, AttestationSelectFieldsEnum.DATE];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case AttestationSelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case AttestationSelectFieldsEnum.DATE:
            attributes.push('date');
            break;

          case AttestationSelectFieldsEnum.DESCRIPTION:
            attributes.push('description');
            break;

          case AttestationSelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case AttestationSelectFieldsEnum.GUID:
            attributes.push('guid');
            break;

          case AttestationSelectFieldsEnum.TEACHER_ID:
            if (!includes.teacher)
              includes.teacher = {model: TeacherDbModel, attributes: ['id']}
            else
              (includes.teacher.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case AttestationSelectFieldsEnum.TEACHER_NAME:
            if (!includes.teacher)
              includes.teacher = {model: TeacherDbModel, attributes: ['fullName']}
            else
              (includes.teacher.attributes as Array<string | ProjectionAlias>).push('fullName');
            break;

          case AttestationSelectFieldsEnum.CATEGORY_ID:
            if (!includes.category)
              includes.category = {model: CategoryDbModel, attributes: ['id']}
            else
              (includes.category.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case AttestationSelectFieldsEnum.CATEGORY_NAME:
            if (!includes.category)
              includes.category = {model: CategoryDbModel, attributes: ['name']}
            else
              (includes.category.attributes as Array<string | ProjectionAlias>).push('name');
            break;
        }
      });

      //endregion

      //region Filters

      const filters: WhereOptions<AttestationInterface> = {};

      if (!isNil(repoRequest.dateMore)) {
        filters.date = {[Op.gte]: repoRequest.dateMore};
      }

      if (!isNil(repoRequest.dateLess)) {
        if (filters.date) {
          filters.date[Op.lte] = repoRequest.dateLess;
        } else {
          filters.date = {[Op.lte]: repoRequest.dateLess};
        }
      }

      if (!isNil(repoRequest.teacherId)) {
        filters.teacherId = repoRequest.teacherId;
      }

      if (!isNil(repoRequest.categoryId)) {
        filters.categoryId = repoRequest.categoryId;
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
          case AttestationOrderFieldsEnum.ID:
            order.push(['id', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case AttestationOrderFieldsEnum.DATE:
            order.push(['date', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case AttestationOrderFieldsEnum.TEACHER:
            includes.teacher = includes.teacher ?? {model: TeacherDbModel, attributes: []};
            order.push([{model: TeacherDbModel, as: 'teacher'}, 'fullName', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case AttestationOrderFieldsEnum.CATEGORY:
            includes.category = includes.category ?? {model: CategoryDbModel, attributes: []};
            order.push([{model: CategoryDbModel, as: 'category'}, 'name', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;
        }
      } else {
        order.push(['id', 'ASC']);
      }

      //endregion

      const data = await this.attestationDbModel.findAndCountAll({
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

  async createAttestation(repoRequest: AttestationCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.attestationDbModel.create({
        date: repoRequest.date,
        description: repoRequest.description,
        teacherId: repoRequest.teacherId,
        categoryId: repoRequest.categoryId,
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

  async updateAttestation(repoRequest: AttestationUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    const updateData = {} as AttestationInterface;

    if (!isUndefined(repoRequest.date)) {
      updateData.date = repoRequest.date;
    }

    if (!isUndefined(repoRequest.teacherId)) {
      updateData.teacherId = repoRequest.teacherId;
    }

    if (!isUndefined(repoRequest.categoryId)) {
      updateData.categoryId = repoRequest.categoryId;
    }

    if (!isUndefined(repoRequest.description)) {
      updateData.description = repoRequest.description;
    }

    if (!isEmpty(updateData)) {
      updateData.guid = sequelize.literal('UUID()') as any;
      await this.attestationDbModel.update(updateData, {where: {id: repoRequest.id}});
    }

    return {updatedID: repoRequest.id};
  }

  async deleteAttestation(repoRequest: AttestationDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.attestationDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}});
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
