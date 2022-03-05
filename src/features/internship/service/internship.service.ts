import {Injectable, Logger} from '@nestjs/common';
import {isNil} from 'lodash';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {IdResponse} from '../../../global/types/response/id.response';
import {InternshipRepository} from '../../../data-layer/repositories/internship/internship.repository';
import {InternshipMapper} from '../mapper/internship.mapper';
import {InternshipGetListRequest} from '../types/request/internship-get-list.request';
import {InternshipResponse} from '../types/response/internship.response';
import {InternshipGetByIdRequest} from '../types/request/internship-get-by-id.request';
import {InternshipCreateRequest} from '../types/request/internship-create.request';
import {InternshipUpdateRequest} from '../types/request/internship-update.request';
import {InternshipSelectFieldsEnum} from '../../../data-layer/repositories/internship/enums/internship-select-fields.enum';
import {InternshipGetHoursFromLastAttestationRequest} from '../types/request/internship-get-hours-from-last-attestation.request';
import {InternshipGetHoursFromLastAttestationResponse} from '../types/response/internship-get-hours-from-last-attestation.response';
import {AttestationRepository} from '../../../data-layer/repositories/attestation/attestation.repository';
import {TeacherRepository} from '../../../data-layer/repositories/teacher/teacher.repository';

@Injectable()
export class InternshipService {
  private logger: Logger;

  constructor(
    private internshipRepository: InternshipRepository,
    private teacherRepository: TeacherRepository,
    private internshipMapper: InternshipMapper,
    private attestationRepository: AttestationRepository,
  ) {
    this.logger = new Logger(InternshipService.name);
  }

  async getInternshipList(request: InternshipGetListRequest): Promise<IPaginator<InternshipResponse>> {
    try {
      const repoRequest = this.internshipMapper.getInternshipListRequestToRepoRequest(request);
      const {data} = await this.internshipRepository.getInternships(repoRequest);
      return this.internshipMapper.internshipPaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getInternshipById(request: InternshipGetByIdRequest): Promise<InternshipResponse> {
    try {
      const repoRequest = this.internshipMapper.getInternshipByIdRequestToRepoRequest(request);
      const {data} = await this.internshipRepository.getInternships(repoRequest);

      if (data.responseList?.length) {
        return this.internshipMapper.internshipDbModelToResponse(data.responseList[0]);
      } else {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Internship with id ${request.id} not exist`});
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

  async getInternshipHoursFromLastAttestation(request: InternshipGetHoursFromLastAttestationRequest):
    Promise<InternshipGetHoursFromLastAttestationResponse> {
    try {
      const attestationRepoRequest = this.internshipMapper.initializeGetLastAttestationRepoRequest(request.teacherId);
      const {data: lastAttestation} = await this.attestationRepository.getAttestations(attestationRepoRequest);

      if (!lastAttestation.responseList.length) {
        return {hours: 0};
      } else {
        const getInternshipHoursRepoRequest = this.internshipMapper.initializeGetInternshipHoursRepoRequest(
          request.teacherId,
          lastAttestation.responseList[0].date
        );

        const {data} = await this.internshipRepository.getInternshipHours(getInternshipHoursRepoRequest);
        return {hours: data[0]?.hours || 0};
      }
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async createInternship(request: InternshipCreateRequest): Promise<InternshipResponse> {
    try {
      if (request.from > request.to) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: 'Internship to must be more than from'
        });

        this.logger.error(error);
        throw error;
      }

      await this.validateRequest(request);

      const createRepoRequest = this.internshipMapper.createInternshipRequestToRepoRequest(request);
      const {createdID} = await this.internshipRepository.createInternship(createRepoRequest);

      const repoRequest = this.internshipMapper.initializeGetInternshipByIdRepoRequest(createdID, request.select);
      const {data} = await this.internshipRepository.getInternships(repoRequest);
      return this.internshipMapper.internshipDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateInternship(request: InternshipUpdateRequest): Promise<InternshipResponse> {
    try {
      const getCurrentInternshipRepoRequest = this.internshipMapper.initializeGetInternshipByIdRepoRequest(
        request.id,
        [
          InternshipSelectFieldsEnum.GUID, InternshipSelectFieldsEnum.IS_DELETED,
          InternshipSelectFieldsEnum.FROM, InternshipSelectFieldsEnum.TO
        ]
      );
      const currentInternship = await this.internshipRepository.getInternships(getCurrentInternshipRepoRequest);

      if (!currentInternship.data.responseList?.length) {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Internship with id ${request.id} not exist`});
        this.logger.error(error);
        throw error;
      } else if (currentInternship.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Internship with id ${request.id} is deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentInternship.data.responseList[0].guid !== request.guid) {
        const error = new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Internship guid was changed'});
        this.logger.error(error);
        throw error;
      }

      if (!isNil(request.from) && !isNil(request.to) && request.from > request.to) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: 'Internship to must be more than from'
        });

        this.logger.error(error);
        throw error;
      }

      if (!isNil(request.from) && request.from > currentInternship.data.responseList[0].to) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: 'Internship to must be more than from'
        });

        this.logger.error(error);
        throw error;
      }

      if (!isNil(request.to) && currentInternship.data.responseList[0].from > request.to) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: 'Internship to must be more than from'
        });

        this.logger.error(error);
        throw error;
      }

      await this.validateRequest(request);

      const updateRepoRequest = this.internshipMapper.updateInternshipRequestToRepoRequest(request);
      const {updatedID} = await this.internshipRepository.updateInternship(updateRepoRequest);

      const repoRequest = this.internshipMapper.initializeGetInternshipByIdRepoRequest(updatedID, request.select);
      const {data} = await this.internshipRepository.getInternships(repoRequest);
      return this.internshipMapper.internshipDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deleteInternship(id: number, guid: string): Promise<IdResponse> {
    try {
      const getCurrentInternshipRepoRequest = this.internshipMapper.initializeGetInternshipByIdRepoRequest(
        id,
        [InternshipSelectFieldsEnum.GUID, InternshipSelectFieldsEnum.IS_DELETED]
      );
      const currentInternship = await this.internshipRepository.getInternships(getCurrentInternshipRepoRequest);

      if (!currentInternship.data.responseList?.length) {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Internship with id ${id} not exist`});
        this.logger.error(error);
        throw error;
      } else if (currentInternship.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Internship with id ${id} already deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentInternship.data.responseList[0].guid !== guid) {
        const error = new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Internship guid was changed`});
        this.logger.error(error);
        throw error;
      }

      const deleteRepoRequest = this.internshipMapper.deleteInternshipRequestToRepoRequest(id);
      const {deletedID} = await this.internshipRepository.deleteInternship(deleteRepoRequest);
      return {id: deletedID};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async validateRequest(request: InternshipCreateRequest) {
    //validate user
    if (!isNil(request.teacherId)) {
      const getTeacherRepoRequest = this.internshipMapper.initializeGetTeacherRepoRequest(request.teacherId);
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

    //validate unique code
    if (!isNil(request.code)) {
      const getInternshipByCodeRepoRequest = this.internshipMapper.initializeGetInternshipByCodeRepoRequest(request.code);
      const {data: internshipByCodeData} = await this.internshipRepository.getInternships(getInternshipByCodeRepoRequest);

      if (internshipByCodeData.responseList.length && internshipByCodeData.responseList[0].id !== (request as any).id) {
        const error = new CustomError({
          code: ErrorCodesEnum.VALIDATION,
          message: `Internship with code ${request.code} already exist`
        });

        this.logger.error(error);
        throw error;
      }
    }
  }
}
