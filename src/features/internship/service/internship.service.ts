import {Injectable, Logger} from '@nestjs/common';
import {isNil} from 'lodash';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {IdResponse} from '../../../global/types/response/id.response';
import {UserRepository} from '../../../data-layer/repositories/user/user.repository';
import {InternshipRepository} from '../../../data-layer/repositories/internship/internship.repository';
import {InternshipMapper} from '../mapper/internship.mapper';
import {InternshipGetListRequest} from '../types/request/internship-get-list.request';
import {InternshipResponse} from '../types/response/internship.response';
import {InternshipGetByIdRequest} from '../types/request/internship-get-by-id.request';
import {InternshipCreateRequest} from '../types/request/internship-create.request';
import {InternshipUpdateRequest} from '../types/request/internship-update.request';
import {InternshipSelectFieldsEnum} from '../../../data-layer/repositories/internship/enums/internship-select-fields.enum';

@Injectable()
export class InternshipService {
  private logger: Logger;

  constructor(
    private internshipRepository: InternshipRepository,
    private userRepository: UserRepository,
    private internshipMapper: InternshipMapper,
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
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Internship with id ${request.id} not exist`});
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
        [InternshipSelectFieldsEnum.GUID, InternshipSelectFieldsEnum.IS_DELETED]
      );
      const currentInternship = await this.internshipRepository.getInternships(getCurrentInternshipRepoRequest);

      if (!currentInternship.data.responseList?.length) {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Internship with id ${request.id} not exist`});
      } else if (currentInternship.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Internship with id ${request.id} is deleted`
        });
      } else if (currentInternship.data.responseList[0].guid !== request.guid) {
        throw new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Internship guid was changed'});
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
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Internship with id ${id} not exist`});
      } else if (currentInternship.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Internship with id ${id} already deleted`
        });
      } else if (currentInternship.data.responseList[0].guid !== guid) {
        throw new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Internship guid was changed`});
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
    if (!isNil(request.userId)) {
      const getUserRepoRequest = this.internshipMapper.initializeGetUserRepoRequest(request.userId);
      const {data: userData} = await this.userRepository.getUsers(getUserRepoRequest);

      if (!userData.responseList.length) {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `User with id ${request.userId} not found`
        });
      }

      if (userData.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `User with id ${request.userId} is deleted`
        });
      }
    }
  }
}
