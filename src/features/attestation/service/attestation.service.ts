import {Injectable, Logger} from '@nestjs/common';
import {isNil} from 'lodash';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {IdResponse} from '../../../global/types/response/id.response';
import {AttestationGetListRequest} from '../types/request/attestation-get-list.request';
import {AttestationResponse} from '../types/response/attestation.response';
import {AttestationGetByIdRequest} from '../types/request/attestation-get-by-id.request';
import {AttestationCreateRequest} from '../types/request/attestation-create.request';
import {AttestationUpdateRequest} from '../types/request/attestation-update.request';
import {AttestationMapper} from '../mapper/attestation.mapper';
import {AttestationRepository} from '../../../data-layer/repositories/attestation/attestation.repository';
import {CategoryRepository} from '../../../data-layer/repositories/category/category.repository';
import {AttestationSelectFieldsEnum} from '../../../data-layer/repositories/attestation/enums/attestation-select-fields.enum';
import {TeacherRepository} from '../../../data-layer/repositories/teacher/teacher.repository';

@Injectable()
export class AttestationService {
  private logger: Logger;

  constructor(
    private attestationRepository: AttestationRepository,
    private teacherRepository: TeacherRepository,
    private categoryRepository: CategoryRepository,
    private attestationMapper: AttestationMapper,
  ) {
    this.logger = new Logger(AttestationService.name);
  }

  async getAttestationList(request: AttestationGetListRequest): Promise<IPaginator<AttestationResponse>> {
    try {
      const repoRequest = this.attestationMapper.getAttestationListRequestToRepoRequest(request);
      const {data} = await this.attestationRepository.getAttestations(repoRequest);
      return this.attestationMapper.attestationPaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getAttestationById(request: AttestationGetByIdRequest): Promise<AttestationResponse> {
    try {
      const repoRequest = this.attestationMapper.getAttestationByIdRequestToRepoRequest(request);
      const {data} = await this.attestationRepository.getAttestations(repoRequest);

      if (data.responseList?.length) {
        return this.attestationMapper.attestationDbModelToResponse(data.responseList[0]);
      } else {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Attestation with id ${request.id} not exist`});
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

  async createAttestation(request: AttestationCreateRequest): Promise<AttestationResponse> {
    try {
      await this.validateRequest(request);

      const createRepoRequest = this.attestationMapper.createAttestationRequestToRepoRequest(request);
      const {createdID} = await this.attestationRepository.createAttestation(createRepoRequest);

      const repoRequest = this.attestationMapper.initializeGetAttestationByIdRepoRequest(createdID, request.select);
      const {data} = await this.attestationRepository.getAttestations(repoRequest);
      return this.attestationMapper.attestationDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateAttestation(request: AttestationUpdateRequest): Promise<AttestationResponse> {
    try {
      const getCurrentAttestationRepoRequest = this.attestationMapper.initializeGetAttestationByIdRepoRequest(
        request.id,
        [AttestationSelectFieldsEnum.GUID, AttestationSelectFieldsEnum.IS_DELETED]
      );
      const currentAttestation = await this.attestationRepository.getAttestations(getCurrentAttestationRepoRequest);

      if (!currentAttestation.data.responseList?.length) {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Attestation with id ${request.id} not exist`});
        this.logger.error(error);
        throw error;
      } else if (currentAttestation.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Attestation with id ${request.id} is deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentAttestation.data.responseList[0].guid !== request.guid) {
        const error = new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Attestation guid was changed'});
        this.logger.error(error);
        throw error;
      }

      await this.validateRequest(request);

      const updateRepoRequest = this.attestationMapper.updateAttestationRequestToRepoRequest(request);
      const {updatedID} = await this.attestationRepository.updateAttestation(updateRepoRequest);

      const repoRequest = this.attestationMapper.initializeGetAttestationByIdRepoRequest(updatedID, request.select);
      const {data} = await this.attestationRepository.getAttestations(repoRequest);
      return this.attestationMapper.attestationDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deleteAttestation(id: number, guid: string): Promise<IdResponse> {
    try {
      const getCurrentAttestationRepoRequest = this.attestationMapper.initializeGetAttestationByIdRepoRequest(
        id,
        [AttestationSelectFieldsEnum.GUID, AttestationSelectFieldsEnum.IS_DELETED]
      );
      const currentAttestation = await this.attestationRepository.getAttestations(getCurrentAttestationRepoRequest);

      if (!currentAttestation.data.responseList?.length) {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Attestation with id ${id} not exist`});
        this.logger.error(error);
        throw error;
      } else if (currentAttestation.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Attestation with id ${id} already deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentAttestation.data.responseList[0].guid !== guid) {
        const error = new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Attestation guid was changed`});
        this.logger.error(error);
        throw error;
      }

      const deleteRepoRequest = this.attestationMapper.deleteAttestationRequestToRepoRequest(id);
      const {deletedID} = await this.attestationRepository.deleteAttestation(deleteRepoRequest);
      return {id: deletedID};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async validateRequest(request: AttestationCreateRequest) {
    //validate user
    if (!isNil(request.teacherId)) {
      const getTeacherRepoRequest = this.attestationMapper.initializeGetTeacherRepoRequest(request.teacherId);
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

    //validate category
    if (!isNil(request.categoryId)) {
      const getCategoryRepoRequest = this.attestationMapper.initializeGetCategoryRepoRequest(request.teacherId);
      const {data: categoryData} = await this.categoryRepository.getCategories(getCategoryRepoRequest);

      if (!categoryData.responseList.length) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Category with id ${request.teacherId} not found`
        });

        this.logger.error(error);
        throw error;
      }

      if (categoryData.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Category with id ${request.teacherId} is deleted`
        });

        this.logger.error(error);
        throw error;
      }
    }
  }
}
