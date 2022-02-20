import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {isEmpty, isNil, isUndefined} from 'lodash';
import {AcademicDegreeGetRepoRequest} from './repo-request/academic-degree-get.repo-request';
import sequelize, {Op} from 'sequelize';
import {FindAttributeOptions, WhereOptions} from 'sequelize/dist/lib/model';
import {AcademicDegreeSelectFieldsEnum} from './enums/academic-degree-select-fields.enum';
import {AcademicDegreeGetRepoResponse} from './repo-response/academic-degree-get.repo-response';
import {convertFindAndCountToPaginator} from '../../../global/utils/functions';
import {AcademicDegreeDbModel, AcademicDegreeInterface} from '../../db-models/academic-degree.db-model';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {AcademicDegreeCreateRepoRequest} from './repo-request/academic-degree-create.repo-request';
import {AcademicDegreeUpdateRepoRequest} from './repo-request/academic-degree-update.repo-request';
import {AcademicDegreeDeleteRepoRequest} from './repo-request/academic-degree-delete.repo-request';
import {Sequelize} from 'sequelize-typescript';
import {TeacherRepository} from '../teacher/teacher.repository';
import {TeacherCascadeDeletedByEnum, TeacherDbModel} from '../../db-models/teacher.db-model';

@Injectable()
export class AcademicDegreeRepository {
  private logger: Logger;

  constructor(
    @InjectModel(AcademicDegreeDbModel) private academicDegreeDbModel: typeof AcademicDegreeDbModel,
    private teacherRepository: TeacherRepository,
    private sequelize: Sequelize
  ) {
    this.logger = new Logger(AcademicDegreeRepository.name);
  }

  async getAcademicDegree(repoRequest: AcademicDegreeGetRepoRequest): Promise<AcademicDegreeGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
        repoRequest.select = [AcademicDegreeSelectFieldsEnum.ID, AcademicDegreeSelectFieldsEnum.NAME];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case AcademicDegreeSelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case AcademicDegreeSelectFieldsEnum.NAME:
            attributes.push('name');
            break;

          case AcademicDegreeSelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case AcademicDegreeSelectFieldsEnum.GUID:
            attributes.push('guid');
            break;
        }
      });

      //endregion

      //region Filters

      const filters: WhereOptions<AcademicDegreeInterface> = {};

      if (!isNil(repoRequest.name)) {
        filters.name = {[Op.like]: `%${repoRequest.name || ''}%`};
      }

      if (!isNil(repoRequest.ids)) {
        filters.id = {[Op.in]: repoRequest.ids};
      }

      if (!isNil(repoRequest.id)) {
        filters.id = repoRequest.id;
      }

      if (!repoRequest.showDeleted) {
        filters.isDeleted = false;
      }

      //endregion

      //region Sorting

      const order = [];

      if (repoRequest.orderField) {
        order.push([repoRequest.orderField, repoRequest.isDesc ? 'DESC' : 'ASC']);
      }

      //endregion

      const data = await this.academicDegreeDbModel.findAndCountAll({
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

  async createAcademicDegree(repoRequest: AcademicDegreeCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.academicDegreeDbModel.create({name: repoRequest.name});
      return {createdID: id};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async updateAcademicDegree(repoRequest: AcademicDegreeUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    try {
      const updateData = {} as AcademicDegreeInterface;

      if (!isUndefined(repoRequest.name)) {
        updateData.name = repoRequest.name;
      }

      if (!isEmpty(updateData)) {
        updateData.guid = sequelize.literal('UUID()') as any;
        await this.academicDegreeDbModel.update(updateData, {where: {id: repoRequest.id}});
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

  async deleteAcademicDegree(repoRequest: AcademicDegreeDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.sequelize.transaction({autocommit: true}, t => {
        return this.academicDegreeDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}, transaction: t})
          .then(() => this.academicDegreeDbModel.findByPk(repoRequest.id, {
            transaction: t,
            include: {model: TeacherDbModel, attributes: ['id']}
          }))
          .then(async academicDegree => {
            const teacherIds = academicDegree.teachers.map(teacher => teacher.id);
            console.debug(`Start delete teachers with ids ${teacherIds} that belongs to academic degree with id ${academicDegree.id}`);

            await Promise.all(teacherIds.map(teacherId => this.teacherRepository.deleteTeacher(
                {id: teacherId},
                {transaction: t, cascadeBy: TeacherCascadeDeletedByEnum.ACADEMIC_DEGREE}
              ))
            );

            console.debug(`Finish delete teachers with ids ${teacherIds} that belongs to academic degree with id ${academicDegree.id}`);
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
