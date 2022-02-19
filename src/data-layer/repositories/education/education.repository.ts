import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {EducationDbModel, EducationInterface} from '../../db-models/education.db-model';
import {EducationGetRepoRequest} from './repo-request/education-get.repo-request';
import {EducationGetRepoResponse} from './repo-response/education-get.repo-response';
import sequelize, {IncludeOptions, Op, WhereOptions} from 'sequelize';
import {FindAttributeOptions, ProjectionAlias} from 'sequelize/dist/lib/model';
import {EducationSelectFieldsEnum} from './enums/education-select-fields.enum';
import {UserDbModel} from '../../db-models/user.db-model';
import {EducationQualificationDbModel} from '../../db-models/education-qualification.db-model';
import {isEmpty, isNil, isUndefined} from 'lodash';
import {EducationOrderFieldsEnum} from './enums/education-order-fields.enum';
import {convertFindAndCountToPaginator} from '../../../global/utils/functions';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {EducationCreateRepoRequest} from './repo-request/education-create.repo-request';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {EducationUpdateRepoRequest} from './repo-request/education-update.repo-request';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {EducationDeleteRepoRequest} from './repo-request/education-delete.repo-request';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {TeacherDbModel} from '../../db-models/teacher.db-model';

@Injectable()
export class EducationRepository {
  private logger: Logger;

  constructor(@InjectModel(EducationDbModel) private educationDbModel: typeof EducationDbModel) {
    this.logger = new Logger(EducationRepository.name);
  }

  async getEducation(repoRequest: EducationGetRepoRequest): Promise<EducationGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      const includes: Record<string, IncludeOptions> = {};

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
        repoRequest.select = [EducationSelectFieldsEnum.ID, EducationSelectFieldsEnum.INSTITUTION];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case EducationSelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case EducationSelectFieldsEnum.INSTITUTION:
            attributes.push('institution');
            break;

          case EducationSelectFieldsEnum.SPECIALTY:
            attributes.push('specialty');
            break;

          case EducationSelectFieldsEnum.DESCRIPTION:
            attributes.push('description');
            break;

          case EducationSelectFieldsEnum.YEAR_OF_ISSUE:
            attributes.push('yearOfIssue');
            break;

          case EducationSelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case EducationSelectFieldsEnum.GUID:
            attributes.push('guid');
            break;

          case EducationSelectFieldsEnum.TEACHER_ID:
            if (!includes.teacher)
              includes.teacher = {model: TeacherDbModel, attributes: ['id']}
            else
              (includes.teacher.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case EducationSelectFieldsEnum.TEACHER_NAME:
            if (!includes.teacher)
              includes.teacher = {model: TeacherDbModel, attributes: ['fullName']}
            else
              (includes.teacher.attributes as Array<string | ProjectionAlias>).push('fullName');
            break;

          case EducationSelectFieldsEnum.EDUCATION_QUALIFICATION_ID:
            if (!includes.educationQualification)
              includes.educationQualification = {model: EducationQualificationDbModel, attributes: ['id']}
            else
              (includes.educationQualification.attributes as Array<string | ProjectionAlias>).push('id');
            break;

          case EducationSelectFieldsEnum.EDUCATION_QUALIFICATION_NAME:
            if (!includes.educationQualification)
              includes.educationQualification = {model: EducationQualificationDbModel, attributes: ['name']}
            else
              (includes.educationQualification.attributes as Array<string | ProjectionAlias>).push('name');
            break;
        }
      });

      //endregion

      //region Filters

      const filters: WhereOptions<EducationInterface> = {};

      if (!isNil(repoRequest.institution)) {
        filters.institution = {[Op.like]: `%${repoRequest.institution || ''}%`};
      }

      if (!isNil(repoRequest.specialty)) {
        filters.specialty = {[Op.like]: `%${repoRequest.specialty || ''}%`};
      }

      if (!isNil(repoRequest.yearOfIssueMore)) {
        filters.yearOfIssue = {[Op.gte]: repoRequest.yearOfIssueMore};
      }

      if (!isNil(repoRequest.yearOfIssueLess)) {
        if(!filters.yearOfIssue) {
          filters.yearOfIssue = {[Op.lte]: repoRequest.yearOfIssueLess};
        }
        else {
          filters.yearOfIssue[Op.lte] = repoRequest.yearOfIssueLess;
        }
      }

      if (!isNil(repoRequest.teacherId)) {
        filters.teacherId = repoRequest.teacherId;
      }

      if (!isNil(repoRequest.educationQualificationId)) {
        filters.educationQualificationId = repoRequest.educationQualificationId;
      }

      if (!repoRequest.showDeleted) {
        if(repoRequest.showCascadeDeleted) {
          filters[Op.or] = {isDeleted: false, isCascadeDelete: true};
        }
        else {
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
          case EducationOrderFieldsEnum.ID:
            order.push(['id', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case EducationOrderFieldsEnum.INSTITUTION:
            order.push(['institution', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case EducationOrderFieldsEnum.YEAR_OF_ISSUE:
            order.push(['yearOfIssue', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case EducationOrderFieldsEnum.TEACHER:
            includes.teacher = includes.teacher ?? {model: TeacherDbModel, attributes: []};
            order.push([{model: TeacherDbModel, as: 'teacher'}, 'fullName', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;

          case EducationOrderFieldsEnum.EDUCATION_QUALIFICATION:
            includes.educationQualification = includes.educationQualification ?? {model: EducationQualificationDbModel, attributes: []};
            order.push([{model: EducationQualificationDbModel, as: 'educationQualification'}, 'name', repoRequest.isDesc ? 'DESC' : 'ASC']);
            break;
        }
      } else {
        order.push(['id', 'ASC']);
      }

      //endregion

      const data = await this.educationDbModel.findAndCountAll({
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

  async createEducation(repoRequest: EducationCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.educationDbModel.create({
        educationQualificationId: repoRequest.educationQualificationId,
        teacherId: repoRequest.teacherId,
        institution: repoRequest.institution,
        specialty: repoRequest.specialty,
        description: repoRequest.description,
        yearOfIssue: repoRequest.yearOfIssue
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

  async updateEducation(repoRequest: EducationUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    const updateData = {} as EducationInterface;

    if (!isUndefined(repoRequest.institution)) {
      updateData.institution = repoRequest.institution;
    }

    if (!isUndefined(repoRequest.specialty)) {
      updateData.specialty = repoRequest.specialty;
    }

    if (!isUndefined(repoRequest.teacherId)) {
      updateData.teacherId = repoRequest.teacherId;
    }

    if (!isUndefined(repoRequest.educationQualificationId)) {
      updateData.educationQualificationId = repoRequest.educationQualificationId;
    }

    if (!isUndefined(repoRequest.yearOfIssue)) {
      updateData.yearOfIssue = repoRequest.yearOfIssue;
    }

    if (!isUndefined(repoRequest.description)) {
      updateData.description = repoRequest.description;
    }

    if (!isEmpty(updateData)) {
      updateData.guid = sequelize.literal('UUID()') as any;
      await this.educationDbModel.update(updateData, {where: {id: repoRequest.id}});
    }

    return {updatedID: repoRequest.id};
  }

  async deleteEducation(repoRequest: EducationDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.educationDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}});
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
