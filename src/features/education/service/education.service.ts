import {Injectable, Logger} from '@nestjs/common';
import {isNil} from 'lodash';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {IdResponse} from '../../../global/types/response/id.response';
import {EducationRepository} from '../../../data-layer/repositories/education/education.repository';
import {EducationQualificationRepository} from '../../../data-layer/repositories/education-qualification/education-qualification.repository';
import {EducationMapper} from '../mapper/education.mapper';
import {EducationGetListRequest} from '../types/request/education-get-list.request';
import {EducationResponse} from '../types/response/education.response';
import {EducationGetByIdRequest} from '../types/request/education-get-by-id.request';
import {EducationCreateRequest} from '../types/request/education-create.request';
import {EducationUpdateRequest} from '../types/request/education-update.request';
import {EducationSelectFieldsEnum} from '../../../data-layer/repositories/education/enums/education-select-fields.enum';
import {TeacherRepository} from '../../../data-layer/repositories/teacher/teacher.repository';

@Injectable()
export class EducationService {
  private logger: Logger;

  constructor(
    private educationRepository: EducationRepository,
    private teacherRepository: TeacherRepository,
    private educationQualificationRepository: EducationQualificationRepository,
    private educationMapper: EducationMapper,
  ) {
    this.logger = new Logger(EducationService.name);
  }

  async getEducationList(request: EducationGetListRequest): Promise<IPaginator<EducationResponse>> {
    try {
      const repoRequest = this.educationMapper.getRebukeListRequestToRepoRequest(request);
      const {data} = await this.educationRepository.getEducation(repoRequest);
      return this.educationMapper.educationPaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getEducationById(request: EducationGetByIdRequest): Promise<EducationResponse> {
    try {
      const repoRequest = this.educationMapper.getEducationByIdRequestToRepoRequest(request);
      const {data} = await this.educationRepository.getEducation(repoRequest);

      if (data.responseList?.length) {
        return this.educationMapper.educationDbModelToResponse(data.responseList[0]);
      } else {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Education with id ${request.id} not exist`});
        this.logger.error(error);
        throw error;
      }
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async createEducation(request: EducationCreateRequest): Promise<EducationResponse> {
    try {
      await this.validateRequest(request);

      const createRepoRequest = this.educationMapper.createEducationRequestToRepoRequest(request);
      const {createdID} = await this.educationRepository.createEducation(createRepoRequest);

      const repoRequest = this.educationMapper.initializeGetEducationByIdRepoRequest(createdID, request.select);
      const {data} = await this.educationRepository.getEducation(repoRequest);
      return this.educationMapper.educationDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateEducation(request: EducationUpdateRequest): Promise<EducationResponse> {
    try {
      const getCurrentEducationRepoRequest = this.educationMapper.initializeGetEducationByIdRepoRequest(
        request.id,
        [EducationSelectFieldsEnum.GUID, EducationSelectFieldsEnum.IS_DELETED]
      );
      const currentEducation = await this.educationRepository.getEducation(getCurrentEducationRepoRequest);

      if (!currentEducation.data.responseList?.length) {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Education with id ${request.id} not exist`});
        this.logger.error(error);
        throw error;
      } else if (currentEducation.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Education with id ${request.id} is deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentEducation.data.responseList[0].guid !== request.guid) {
        const error = new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Education guid was changed'});
        this.logger.error(error);
        throw error;
      }

      await this.validateRequest(request);

      const updateRepoRequest = this.educationMapper.updateEducationRequestToRepoRequest(request);
      const {updatedID} = await this.educationRepository.updateEducation(updateRepoRequest);

      const repoRequest = this.educationMapper.initializeGetEducationByIdRepoRequest(updatedID, request.select);
      const {data} = await this.educationRepository.getEducation(repoRequest);
      return this.educationMapper.educationDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deleteEducation(id: number, guid: string): Promise<IdResponse> {
    try {
      const getCurrentEducationRepoRequest = this.educationMapper.initializeGetEducationByIdRepoRequest(
        id,
        [EducationSelectFieldsEnum.GUID, EducationSelectFieldsEnum.IS_DELETED]
      );
      const currentEducation = await this.educationRepository.getEducation(getCurrentEducationRepoRequest);

      if (!currentEducation.data.responseList?.length) {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Education with id ${id} not exist`});
        this.logger.error(error);
        throw error;
      } else if (currentEducation.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Education with id ${id} already deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentEducation.data.responseList[0].guid !== guid) {
        const error = new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Education guid was changed`});
        this.logger.error(error);
        throw error;
      }

      const deleteRepoRequest = this.educationMapper.deleteEducationRequestToRepoRequest(id);
      const {deletedID} = await this.educationRepository.deleteEducation(deleteRepoRequest);
      return {id: deletedID};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async validateRequest(request: EducationCreateRequest) {
    //validate user
    if (!isNil(request.teacherId)) {
      const getTeacherRepoRequest = this.educationMapper.initializeGetTeacherRepoRequest(request.teacherId);
      const {data: teacherData} = await this.teacherRepository.getTeachers(getTeacherRepoRequest);

      if (!teacherData.responseList.length) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Teacher with id ${request.teacherId} not found`
        });

        this.logger.error(error);
        throw error;
      }

      if (teacherData.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Teacher with id ${request.teacherId} is deleted`
        });

        this.logger.error(error);
        throw error;
      }
    }

    //validate education qualification
    if (!isNil(request.educationQualificationId)) {
      const getEducationQualificationRepoRequest = this.educationMapper
        .initializeGetEducationQualificationRepoRequest(request.educationQualificationId);

      const {data: educationQualificationData} = await this.educationQualificationRepository
        .getEducationQualification(getEducationQualificationRepoRequest);

      if (!educationQualificationData.responseList.length) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Education qualification with id ${request.teacherId} not found`
        });

        this.logger.error(error);
        throw error;
      }

      if (educationQualificationData.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Education qualification with id ${request.teacherId} is deleted`
        });

        this.logger.error(error);
        throw error;
      }
    }
  }
}
