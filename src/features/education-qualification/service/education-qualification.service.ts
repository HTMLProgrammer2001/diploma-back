import {Injectable, Logger} from '@nestjs/common';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {IdResponse} from '../../../global/types/response/id.response';
import {EducationQualificationMapper} from '../mapper/education-qualification.mapper';
import {EducationQualificationRepository} from '../../../data-layer/repositories/education-qualification/education-qualification.repository';
import {EducationQualificationGetListRequest} from '../types/request/education-qualification-get-list.request';
import {EducationQualificationResponse} from '../types/response/education-qualification.response';
import {EducationQualificationGetByIdRequest} from '../types/request/education-qualification-get-by-id.request';
import {EducationQualificationCreateRequest} from '../types/request/education-qualification-create.request';
import {EducationQualificationUpdateRequest} from '../types/request/education-qualification-update.request';
import {EducationQualificationSelectFieldsEnum} from '../../../data-layer/repositories/education-qualification/enums/education-qualification-select-fields.enum';

@Injectable()
export class EducationQualificationService {
  private logger: Logger;

  constructor(
    private educationQualificationRepository: EducationQualificationRepository,
    private educationQualificationMapper: EducationQualificationMapper,
  ) {
    this.logger = new Logger(EducationQualificationService.name);
  }

  async getEducationQualificationList(request: EducationQualificationGetListRequest):
    Promise<IPaginator<EducationQualificationResponse>> {
    try {
      const repoRequest = this.educationQualificationMapper.getEducationQualificationListRequestToRepoRequest(request);
      const {data} = await this.educationQualificationRepository.getEducationQualification(repoRequest);
      return this.educationQualificationMapper.educationQualificationPaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getEducationQualificationById(request: EducationQualificationGetByIdRequest): Promise<EducationQualificationResponse> {
    try {
      const repoRequest = this.educationQualificationMapper.getEducationQualificationByIdRequestToRepoRequest(request);
      const {data} = await this.educationQualificationRepository.getEducationQualification(repoRequest);

      if (data.responseList?.length) {
        return this.educationQualificationMapper.educationQualificationDbModelToResponse(data.responseList[0]);
      } else {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Education qualification with id ${request.id} not exist`
        });
      }
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async createEducationQualification(request: EducationQualificationCreateRequest): Promise<EducationQualificationResponse> {
    try {
      const createRepoRequest = this.educationQualificationMapper.createEducationQualificationRequestToRepoRequest(request);
      const {createdID} = await this.educationQualificationRepository.createEducationQualification(createRepoRequest);

      const repoRequest = this.educationQualificationMapper.initializeEducationQualificationGetByIdRepoRequest(createdID, request.select);
      const {data} = await this.educationQualificationRepository.getEducationQualification(repoRequest);
      return this.educationQualificationMapper.educationQualificationDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateEducationQualification(request: EducationQualificationUpdateRequest): Promise<EducationQualificationResponse> {
    try {
      const getCurrentEducationQualificationRepoRequest = this.educationQualificationMapper
        .initializeEducationQualificationGetByIdRepoRequest(
          request.id,
          [EducationQualificationSelectFieldsEnum.GUID, EducationQualificationSelectFieldsEnum.IS_DELETED]
        );

      const currentEducationQualification = await this.educationQualificationRepository
        .getEducationQualification(getCurrentEducationQualificationRepoRequest);

      if (!currentEducationQualification.data.responseList?.length) {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Education qualification with id ${request.id} not exist`
        });
      } else if (currentEducationQualification.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Education qualification with id ${request.id} is deleted`
        });
      } else if (currentEducationQualification.data.responseList[0].guid !== request.guid) {
        throw new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Education qualification guid was changed'});
      }

      const updateRepoRequest = this.educationQualificationMapper.updateEducationQualificationRequestToRepoRequest(request);
      const {updatedID} = await this.educationQualificationRepository.updateEducationQualification(updateRepoRequest);

      const repoRequest = this.educationQualificationMapper
        .initializeEducationQualificationGetByIdRepoRequest(updatedID, request.select);

      const {data} = await this.educationQualificationRepository.getEducationQualification(repoRequest);
      return this.educationQualificationMapper.educationQualificationDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deleteEducationQualification(id: number, guid: string): Promise<IdResponse> {
    try {
      const getCurrentEducationQualificationRepoRequest = this.educationQualificationMapper
        .initializeEducationQualificationGetByIdRepoRequest(
          id,
          [EducationQualificationSelectFieldsEnum.GUID, EducationQualificationSelectFieldsEnum.IS_DELETED]
        );

      const currentEducationQualification = await this.educationQualificationRepository
        .getEducationQualification(getCurrentEducationQualificationRepoRequest);

      if (!currentEducationQualification.data.responseList?.length) {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Education qualification with id ${id} not exist`
        });
      } else if (currentEducationQualification.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Education qualification with id ${id} already deleted`
        });
      } else if (currentEducationQualification.data.responseList[0].guid !== guid) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Education qualification guid was changed`
        });
      }

      const deleteRepoRequest = this.educationQualificationMapper.deleteEducationQualificationRequestToRepoRequest(id);
      const {deletedID} = await this.educationQualificationRepository.deleteEducationQualification(deleteRepoRequest);
      return {id: deletedID};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }
}
