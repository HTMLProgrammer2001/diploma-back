import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {TeacherDbModel} from '../../db-models/teacher.db-model';
import {TeacherGetRepoRequest} from './repo-request/teacher-get.repo-request';
import {TeacherGetRepoResponse} from './repo-response/teacher-get.repo-response';
import {FindAttributeOptions, IncludeOptions, ProjectionAlias} from 'sequelize/dist/lib/model';
import {TeacherSelectFieldsEnum} from './enums/teacher-select-fields.enum';
import {Op, WhereOptions} from 'sequelize';
import {isNil} from 'lodash';
import {convertFindAndCountToPaginator} from '../../../common/utils/functions';
import {TeacherOrderFieldsEnum} from './enums/teacher-order-fields.enum';
import {CommissionDbModel} from '../../db-models/commission.db-model';
import {DepartmentDbModel} from '../../db-models/department.db-model';
import {TeachingRankDbModel} from '../../db-models/teaching-rank.db-model';
import {AcademicDegreeDbModel} from '../../db-models/academic-degree.db-model';
import {AcademicTitleDbModel} from '../../db-models/academic-title.db-model';
import {TeacherCreateRepoRequest} from './repo-request/teacher-create.repo-request';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {TeacherDeleteRepoRequest} from './repo-request/teacher-delete.repo-request';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {CustomError} from '../../../common/class/custom-error';
import {ErrorCodesEnum} from '../../../common/constants/error-codes.enum';

@Injectable()
export class TeacherRepository {
  private logger: Logger;

  constructor(@InjectModel(TeacherDbModel) private teacherDbModel: typeof TeacherDbModel) {
    this.logger = new Logger(TeacherRepository.name);
  }

  async getTeachers(repoRequest: TeacherGetRepoRequest): Promise<TeacherGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      const includes: Record<string, IncludeOptions> = {};

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
        repoRequest.select = [TeacherSelectFieldsEnum.ID, TeacherSelectFieldsEnum.FULL_NAME];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case TeacherSelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case TeacherSelectFieldsEnum.FULL_NAME:
            attributes.push('fullName');
            break;

          case TeacherSelectFieldsEnum.EMAIL:
            attributes.push('email');
            break;

          case TeacherSelectFieldsEnum.BIRTHDAY:
            attributes.push('birthday');
            break;

          case TeacherSelectFieldsEnum.PHONE:
            attributes.push('phone');
            break;

          case TeacherSelectFieldsEnum.ADDRESS:
            attributes.push('address');
            break;

          case TeacherSelectFieldsEnum.AVATAR_URL:
            attributes.push('avatarUrl');
            break;

          case TeacherSelectFieldsEnum.WORK_START_DATE:
            attributes.push('workStartDate');
            break;

          case TeacherSelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case TeacherSelectFieldsEnum.GUID:
            attributes.push('guid');
            break;

          case TeacherSelectFieldsEnum.COMMISSION_ID:
            if (!includes.commission)
              includes.commission = {model: CommissionDbModel, attributes: ['id']}
            else
              (includes.commission.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case TeacherSelectFieldsEnum.COMMISSION_NAME:
            if (!includes.commission)
              includes.commission = {model: CommissionDbModel, attributes: ['name']}
            else
              (includes.commission.attributes as Array<string | ProjectionAlias>).push('name');
            break;

          case TeacherSelectFieldsEnum.DEPARTMENT_ID:
            if (!includes.department)
              includes.department = {model: DepartmentDbModel, attributes: ['id']}
            else
              (includes.department.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case TeacherSelectFieldsEnum.DEPARTMENT_NAME:
            if (!includes.department)
              includes.department = {model: DepartmentDbModel, attributes: ['name']}
            else
              (includes.department.attributes as Array<string | ProjectionAlias>).push('name');
            break;

          case TeacherSelectFieldsEnum.TEACHER_RANK_ID:
            if (!includes.teachingRank)
              includes.teachingRank = {model: TeachingRankDbModel, attributes: ['id']}
            else
              (includes.teachingRank.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case TeacherSelectFieldsEnum.TEACHER_RANK_NAME:
            if (!includes.teachingRank)
              includes.teachingRank = {model: TeachingRankDbModel, attributes: ['name']}
            else
              (includes.teachingRank.attributes as Array<string | ProjectionAlias>).push('name');
            break;

          case TeacherSelectFieldsEnum.ACADEMIC_DEGREE_ID:
            if (!includes.academicDegree)
              includes.academicDegree = {model: AcademicDegreeDbModel, attributes: ['id']}
            else
              (includes.academicDegree.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case TeacherSelectFieldsEnum.ACADEMIC_DEGREE_NAME:
            if (!includes.academicDegree)
              includes.academicDegree = {model: AcademicDegreeDbModel, attributes: ['name']}
            else
              (includes.academicDegree.attributes as Array<string | ProjectionAlias>).push('name');
            break;

          case TeacherSelectFieldsEnum.ACADEMIC_TITLE_ID:
            if (!includes.academicTitle)
              includes.academicTitle = {model: AcademicTitleDbModel, attributes: ['id']}
            else
              (includes.academicTitle.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case TeacherSelectFieldsEnum.ACADEMIC_TITLE_NAME:
            if (!includes.academicTitle)
              includes.academicTitle = {model: AcademicTitleDbModel, attributes: ['name']}
            else
              (includes.academicTitle.attributes as Array<string | ProjectionAlias>).push('name');
            break;
        }
      });

      //endregion

      //region Filters

      const filters: WhereOptions = {};

      if (!isNil(repoRequest.fullName)) {
        filters.name = {[Op.like]: `%${repoRequest.fullName || ''}%`};
      }

      if (!isNil(repoRequest.email)) {
        filters.name = {[Op.like]: `%${repoRequest.email || ''}%`};
      }

      if (!isNil(repoRequest.departmentId)) {
        filters.departmentId = {[Op.eq]: repoRequest.departmentId};
      }

      if (!isNil(repoRequest.commissionId)) {
        filters.commissionId = {[Op.eq]: repoRequest.commissionId};
      }

      if (!isNil(repoRequest.teacherRankId)) {
        filters.teacherRankId = {[Op.eq]: repoRequest.teacherRankId};
      }

      if (!isNil(repoRequest.academicDegreeId)) {
        filters.academicDegreeId = {[Op.eq]: repoRequest.academicDegreeId};
      }

      if (!isNil(repoRequest.academicTitleId)) {
        filters.academicTitleId = {[Op.eq]: repoRequest.academicTitleId};
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
          case TeacherOrderFieldsEnum.ID:
            order.push(['id', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case TeacherOrderFieldsEnum.FULL_NAME:
            order.push(['fullName', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case TeacherOrderFieldsEnum.COMMISSION_NAME:
            includes.commission = includes.commission ?? {model: CommissionDbModel, attributes: []};
            order.push([CommissionDbModel, 'name', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case TeacherOrderFieldsEnum.DEPARTMENT_NAME:
            includes.commission = includes.commission ?? {model: DepartmentDbModel, attributes: []};
            order.push([DepartmentDbModel, 'name', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;
        }
      } else {
        order.push(['id', 'ASC']);
      }

      //endregion

      const data = await this.teacherDbModel.findAndCountAll({
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

  async createTeacher(repoRequest: TeacherCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.teacherDbModel.create({
        fullName: repoRequest.fullName,
        email: repoRequest.email,
        address: repoRequest.address,
        avatarUrl: repoRequest.avatarUrl,
        birthday: repoRequest.birthday,
        phone: repoRequest.phone,
        workStartDate: repoRequest.workStartDate,
        departmentId: repoRequest.departmentId,
        commissionId: repoRequest.commissionId,
        teacherRankId: repoRequest.teacherRankId,
        academicDegreeId: repoRequest.academicDegreeId,
        academicTitleId: repoRequest.academicTitleId,
      });
      return {createdID: id};
    }  catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  //
  // async updateTeachingRank(repoRequest: TeacherUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
  //   const updateData = {} as Omit<TeachingRankDbModel, keyof Model>;
  //
  //   if(!isUndefined(repoRequest.name)) {
  //     updateData.name = repoRequest.name;
  //   }
  //
  //   if(!isEmpty(updateData)) {
  //     updateData.guid = sequelize.literal('UUID()') as any;
  //     await this.teachingRankDbModel.update(updateData, {where: {id: repoRequest.id}});
  //   }
  //
  //   return {updatedID: repoRequest.id};
  // }

  async deleteTeacher(repoRequest: TeacherDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.teacherDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}});
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
