import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {CommissionDbModel, CommissionInterface} from '../../db-models/commission.db-model';
import {isEmpty, isNil, isUndefined} from 'lodash';
import {CommissionGetRepoRequest} from './repo-request/commission-get.repo-request';
import sequelize, {Op} from 'sequelize';
import {FindAttributeOptions, WhereOptions} from 'sequelize/dist/lib/model';
import {CommissionSelectFieldsEnum} from './enums/commission-select-fields.enum';
import {CommissionGetRepoResponse} from './repo-response/commission-get.repo-response';
import {convertFindAndCountToPaginator} from '../../../global/utils/functions';
import {CommissionCreateRepoRequest} from './repo-request/commission-create.repo-request';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {CommissionDeleteRepoRequest} from './repo-request/commission-delete.repo-request';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {CommissionUpdateRepoRequest} from './repo-request/commission-update.repo-request';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {Sequelize} from 'sequelize-typescript';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {TeacherRepository} from '../teacher/teacher.repository';
import {TeacherCascadeDeletedByEnum, TeacherDbModel} from '../../db-models/teacher.db-model';

@Injectable()
export class CommissionRepository {
  private logger: Logger;

  constructor(
    @InjectModel(CommissionDbModel) private commissionModel: typeof CommissionDbModel,
    private sequelize: Sequelize,
    private teacherRepository: TeacherRepository,
  ) {
    this.logger = new Logger(CommissionRepository.name);
  }

  async getCommissions(repoRequest: CommissionGetRepoRequest): Promise<CommissionGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
        repoRequest.select = [CommissionSelectFieldsEnum.ID, CommissionSelectFieldsEnum.NAME];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case CommissionSelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case CommissionSelectFieldsEnum.NAME:
            attributes.push('name');
            break;

          case CommissionSelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case CommissionSelectFieldsEnum.GUID:
            attributes.push('guid');
            break;
        }
      });

      //endregion

      //region Filters

      const filters: WhereOptions<CommissionInterface> = {};

      if (repoRequest.name) {
        filters.name = {[Op.like]: `%${repoRequest.name || ''}%`};
      }

      if (!repoRequest.showDeleted) {
        filters.isDeleted = false;
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

      const data = await this.commissionModel.findAndCountAll({
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

  async createCommission(repoRequest: CommissionCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.commissionModel.create({name: repoRequest.name});
      return {createdID: id};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async updateCommission(repoRequest: CommissionUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    try {
      const updateData = {} as CommissionInterface;

      if (!isUndefined(repoRequest.name)) {
        updateData.name = repoRequest.name;
      }

      if (!isEmpty(updateData)) {
        updateData.guid = sequelize.literal('UUID()') as any;
        await this.commissionModel.update(updateData, {where: {id: repoRequest.id}});
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

  async deleteCommission(repoRequest: CommissionDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.sequelize.transaction({autocommit: true}, t => {
        return this.commissionModel.update({isDeleted: true}, {where: {id: repoRequest.id}, transaction: t})
          .then(() => this.commissionModel.findByPk(repoRequest.id, {
            transaction: t,
            include: {model: TeacherDbModel, attributes: ['id'], where: {isDeleted: false}, required: false}
          }))
          .then(async commission => {
            const teacherIds = commission.teachers.map(teacher => teacher.id);
            console.debug(`Start delete teachers with ids ${teacherIds} that belongs to commission with id ${commission.id}`);

            await Promise.all(teacherIds.map(teacherId => this.teacherRepository.deleteTeacher(
              {id: teacherId},
              {transaction: t, cascadeBy: TeacherCascadeDeletedByEnum.COMMISSION}
            )));

            console.debug(`Finish delete teachers with ids ${teacherIds} that belongs to commission with id ${commission.id}`);
          });
      });

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
