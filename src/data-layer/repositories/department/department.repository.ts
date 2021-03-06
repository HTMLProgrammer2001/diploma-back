import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {isEmpty, isNil, isUndefined} from 'lodash';
import {DepartmentGetRepoRequest} from './repo-request/department-get.repo-request';
import sequelize, {Op} from 'sequelize';
import {FindAttributeOptions, WhereOptions} from 'sequelize/dist/lib/model';
import {DepartmentSelectFieldsEnum} from './enums/department-select-fields.enum';
import {DepartmentGetRepoResponse} from './repo-response/department-get.repo-response';
import {convertFindAndCountToPaginator} from '../../../global/utils/functions';
import {DepartmentCreateRepoRequest} from './repo-request/department-create.repo-request';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {DepartmentDeleteRepoRequest} from './repo-request/department-delete.repo-request';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {DepartmentUpdateRepoRequest} from './repo-request/department-update.repo-request';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {Sequelize} from 'sequelize-typescript';
import {DepartmentDbModel, DepartmentInterface} from '../../db-models/department.db-model';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {TeacherRepository} from '../teacher/teacher.repository';
import {TeacherCascadeDeletedByEnum, TeacherDbModel} from '../../db-models/teacher.db-model';

@Injectable()
export class DepartmentRepository {
  private logger: Logger;

  constructor(
    @InjectModel(DepartmentDbModel) private departmentDbModel: typeof DepartmentDbModel,
    private sequelize: Sequelize,
    private teacherRepository: TeacherRepository,
  ) {
    this.logger = new Logger(DepartmentRepository.name);
  }

  async getDepartments(repoRequest: DepartmentGetRepoRequest): Promise<DepartmentGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
        repoRequest.select = [DepartmentSelectFieldsEnum.ID, DepartmentSelectFieldsEnum.NAME];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case DepartmentSelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case DepartmentSelectFieldsEnum.NAME:
            attributes.push('name');
            break;

          case DepartmentSelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case DepartmentSelectFieldsEnum.GUID:
            attributes.push('guid');
            break;
        }
      });

      //endregion

      //region Filters

      const filters: WhereOptions<DepartmentInterface> = {};

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

      const data = await this.departmentDbModel.findAndCountAll({
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

  async createDepartment(repoRequest: DepartmentCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.departmentDbModel.create({name: repoRequest.name});
      return {createdID: id};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async updateDepartment(repoRequest: DepartmentUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    try {
      const updateData = {} as DepartmentInterface;

      if (!isUndefined(repoRequest.name)) {
        updateData.name = repoRequest.name;
      }

      if (!isEmpty(updateData)) {
        updateData.guid = sequelize.literal('UUID()') as any;
        await this.departmentDbModel.update(updateData, {where: {id: repoRequest.id}});
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

  async deleteDepartment(repoRequest: DepartmentDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.sequelize.transaction({autocommit: true}, t => {
        return this.departmentDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}, transaction: t})
          .then(() => this.departmentDbModel.findByPk(repoRequest.id, {
            transaction: t,
            include: {model: TeacherDbModel, attributes: ['id'], where: {isDeleted: false}, required: false}
          }))
          .then(async department => {
            const teacherIds = department.teachers.map(teacher => teacher.id);
            console.debug(`Start delete teachers with ids ${teacherIds} that belongs to commission with id ${department.id}`);

            await Promise.all(department.teachers.map(teacher => this.teacherRepository.deleteTeacher(
              {id: teacher.id},
              {transaction: t, cascadeBy: TeacherCascadeDeletedByEnum.DEPARTMENT}
            )));

            console.debug(`Finish delete teachers with ids ${teacherIds} that belongs to commission with id ${department.id}`);
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
