import {Injectable, Logger} from '@nestjs/common';
import {isNil} from 'lodash';
import {HonorMapper} from '../mapper/honor.mapper';
import {HonorGetListRequest} from '../types/request/honor-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {HonorResponse} from '../types/response/honor.response';
import {HonorGetByIdRequest} from '../types/request/honor-get-by-id.request';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {HonorCreateRequest} from '../types/request/honor-create.request';
import {IdResponse} from '../../../global/types/response/id.response';
import {HonorUpdateRequest} from '../types/request/honor-update.request';
import {HonorRepository} from '../../../data-layer/repositories/honor/honor.repository';
import {UserRepository} from '../../../data-layer/repositories/user/user.repository';
import {HonorSelectFieldsEnum} from '../../../data-layer/repositories/honor/enums/honor-select-fields.enum';

@Injectable()
export class HonorService {
  private logger: Logger;

  constructor(
    private honorRepository: HonorRepository,
    private userRepository: UserRepository,
    private honorMapper: HonorMapper,
  ) {
    this.logger = new Logger(HonorService.name);
  }

  async getHonorList(request: HonorGetListRequest): Promise<IPaginator<HonorResponse>> {
    try {
      const repoRequest = this.honorMapper.getHonorListRequestToRepoRequest(request);
      const {data} = await this.honorRepository.getHonors(repoRequest);
      return this.honorMapper.honorPaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getHonorById(request: HonorGetByIdRequest): Promise<HonorResponse> {
    try {
      const repoRequest = this.honorMapper.getHonorByIdRequestToRepoRequest(request);
      const {data} = await this.honorRepository.getHonors(repoRequest);

      if (data.responseList?.length) {
        return this.honorMapper.honorDbModelToResponse(data.responseList[0]);
      } else {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Honor with id ${request.id} not exist`});
      }
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async createHonor(request: HonorCreateRequest): Promise<HonorResponse> {
    try {
      await this.validateRequest(request);

      const createRepoRequest = this.honorMapper.createHonorRequestToRepoRequest(request);
      const {createdID} = await this.honorRepository.createHonor(createRepoRequest);

      const repoRequest = this.honorMapper.initializeGetHonorByIdRepoRequest(createdID, request.select);
      const {data} = await this.honorRepository.getHonors(repoRequest);
      return this.honorMapper.honorDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateHonor(request: HonorUpdateRequest): Promise<HonorResponse> {
    try {
      const getCurrentHonorRepoRequest = this.honorMapper.initializeGetHonorByIdRepoRequest(
        request.id,
        [HonorSelectFieldsEnum.GUID, HonorSelectFieldsEnum.IS_DELETED]
      );
      const currentHonor = await this.honorRepository.getHonors(getCurrentHonorRepoRequest);

      if (!currentHonor.data.responseList?.length) {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Honor with id ${request.id} not exist`});
      } else if (currentHonor.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Honor with id ${request.id} is deleted`
        });
      } else if (currentHonor.data.responseList[0].guid !== request.guid) {
        throw new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Honor guid was changed'});
      }

      await this.validateRequest(request);

      const updateRepoRequest = this.honorMapper.updateHonorRequestToRepoRequest(request);
      const {updatedID} = await this.honorRepository.updateHonor(updateRepoRequest);

      const repoRequest = this.honorMapper.initializeGetHonorByIdRepoRequest(updatedID, request.select);
      const {data} = await this.honorRepository.getHonors(repoRequest);
      return this.honorMapper.honorDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deleteHonor(id: number, guid: string): Promise<IdResponse> {
    try {
      const getCurrentHonorRepoRequest = this.honorMapper.initializeGetHonorByIdRepoRequest(
        id,
        [HonorSelectFieldsEnum.GUID, HonorSelectFieldsEnum.IS_DELETED]
      );
      const currentHonor = await this.honorRepository.getHonors(getCurrentHonorRepoRequest);

      if (!currentHonor.data.responseList?.length) {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Honor with id ${id} not exist`});
      } else if (currentHonor.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Honor with id ${id} already deleted`
        });
      } else if (currentHonor.data.responseList[0].guid !== guid) {
        throw new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Honor guid was changed`});
      }

      const deleteRepoRequest = this.honorMapper.deleteHonorRequestToRepoRequest(id);
      const {deletedID} = await this.honorRepository.deleteHonor(deleteRepoRequest);
      return {id: deletedID};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async validateRequest(request: HonorCreateRequest) {
    //validate user
    if (!isNil(request.userId)) {
      const getUserRepoRequest = this.honorMapper.initializeGetUserRepoRequest(request.userId);
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

    //validate unique orderNumber
    if (!isNil(request.orderNumber)) {
      const getHonorByOrderNumberRepoRequest = this.honorMapper.initializeGetHonorByOrderNumberRepoRequest(request.orderNumber);
      const {data: honorByOrderNumberData} = await this.honorRepository.getHonors(getHonorByOrderNumberRepoRequest);

      if (honorByOrderNumberData.responseList.length && honorByOrderNumberData.responseList[0].id !== (request as any).id) {
        throw new CustomError({
          code: ErrorCodesEnum.VALIDATION,
          message: `Honor with order number ${request.orderNumber} already exist`
        });
      }
    }
  }
}
