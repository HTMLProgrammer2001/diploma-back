import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {isEmpty, isNil, isUndefined} from 'lodash';
import sequelize, {Op} from 'sequelize';
import {FindAttributeOptions, WhereOptions} from 'sequelize/dist/lib/model';
import {Model} from 'sequelize-typescript';
import {convertFindAndCountToPaginator} from '../../../global/utils/functions';
import {AcademicDegreeDbModel} from '../../db-models/academic-degree.db-model';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {CommonCreateRepoResponse} from '../common/common-create.repo-response';
import {CommonUpdateRepoResponse} from '../common/common-update.repo-response';
import {CommonDeleteRepoResponse} from '../common/common-delete.repo-response';
import {EducationQualificationGetRepoRequest} from './repo-request/education-qualification-get.repo-request';
import {EducationQualificationGetRepoResponse} from './repo-response/education-qualification-get.repo-response';
import {EducationQualificationSelectFieldsEnum} from './enums/education-qualification-select-fields.enum';
import {
  EducationQualificationDbModel,
  EducationQualificationInterface
} from '../../db-models/education-qualification.db-model';
import {EducationQualificationCreateRepoRequest} from './repo-request/education-qualification-create.repo-request';
import {EducationQualificationUpdateRepoRequest} from './repo-request/education-qualification-update.repo-request';
import {EducationQualificationDeleteRepoRequest} from './repo-request/education-qualification-delete.repo-request';

@Injectable()
export class EducationQualificationRepository {
  private logger: Logger;

  constructor(@InjectModel(EducationQualificationDbModel) private educationQualificationDbModel: typeof EducationQualificationDbModel) {
    this.logger = new Logger(EducationQualificationRepository.name);
  }

  async getEducationQualification(repoRequest: EducationQualificationGetRepoRequest):
    Promise<EducationQualificationGetRepoResponse> {
    try {
      repoRequest.page = repoRequest.page ?? 1;
      repoRequest.size = repoRequest.size ?? 5;

      //region Select

      const attributes: FindAttributeOptions = [];

      if (!repoRequest) {
        repoRequest.select = [EducationQualificationSelectFieldsEnum.ID, EducationQualificationSelectFieldsEnum.NAME];
      }

      repoRequest.select.forEach(field => {
        switch (field) {
          case EducationQualificationSelectFieldsEnum.ID:
            attributes.push('id');
            break;

          case EducationQualificationSelectFieldsEnum.NAME:
            attributes.push('name');
            break;

          case EducationQualificationSelectFieldsEnum.IS_DELETED:
            attributes.push('isDeleted');
            break;

          case EducationQualificationSelectFieldsEnum.GUID:
            attributes.push('guid');
            break;
        }
      });

      //endregion

      //region Filters

      const filters: WhereOptions<EducationQualificationInterface> = {};

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

      const data = await this.educationQualificationDbModel.findAndCountAll({
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

  async createEducationQualification(repoRequest: EducationQualificationCreateRepoRequest): Promise<CommonCreateRepoResponse> {
    try {
      const {id} = await this.educationQualificationDbModel.create({name: repoRequest.name});
      return {createdID: id};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.DATABASE, message: e.message});
      }

      throw e;
    }
  }

  async updateEducationQualification(repoRequest: EducationQualificationUpdateRepoRequest): Promise<CommonUpdateRepoResponse> {
    try {
      const updateData = {} as EducationQualificationInterface;

      if (!isUndefined(repoRequest.name)) {
        updateData.name = repoRequest.name;
      }

      if (!isEmpty(updateData)) {
        updateData.guid = sequelize.literal('UUID()') as any;
        await this.educationQualificationDbModel.update(updateData, {where: {id: repoRequest.id}});
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

  async deleteEducationQualification(repoRequest: EducationQualificationDeleteRepoRequest): Promise<CommonDeleteRepoResponse> {
    try {
      await this.educationQualificationDbModel.update({isDeleted: true}, {where: {id: repoRequest.id}});
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
