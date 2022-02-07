import {Injectable, Logger} from '@nestjs/common';
import {isNil} from 'lodash';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {IdResponse} from '../../../global/types/response/id.response';
import {UserRepository} from '../../../data-layer/repositories/user/user.repository';
import {RebukeRepository} from '../../../data-layer/repositories/rebuke/rebuke.repository';
import {RebukeGetListRequest} from '../types/request/rebuke-get-list.request';
import {RebukeResponse} from '../types/response/rebuke.response';
import {RebukeGetByIdRequest} from '../types/request/rebuke-get-by-id.request';
import {RebukeCreateRequest} from '../types/request/rebuke-create.request';
import {RebukeUpdateRequest} from '../types/request/rebuke-update.request';
import {RebukeSelectFieldsEnum} from '../../../data-layer/repositories/rebuke/enums/rebuke-select-fields.enum';
import {RebukeMapper} from '../mapper/rebuke.mapper';

@Injectable()
export class RebukeService {
  private logger: Logger;

  constructor(
    private rebukeRepository: RebukeRepository,
    private userRepository: UserRepository,
    private rebukeMapper: RebukeMapper,
  ) {
    this.logger = new Logger(RebukeService.name);
  }

  async getRebukeList(request: RebukeGetListRequest): Promise<IPaginator<RebukeResponse>> {
    try {
      const repoRequest = this.rebukeMapper.getRebukeListRequestToRepoRequest(request);
      const {data} = await this.rebukeRepository.getRebukes(repoRequest);
      return this.rebukeMapper.rebukePaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getRebukeById(request: RebukeGetByIdRequest): Promise<RebukeResponse> {
    try {
      const repoRequest = this.rebukeMapper.getRebukeByIdRequestToRepoRequest(request);
      const {data} = await this.rebukeRepository.getRebukes(repoRequest);

      if (data.responseList?.length) {
        return this.rebukeMapper.rebukeDbModelToResponse(data.responseList[0]);
      } else {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Rebuke with id ${request.id} not exist`});
      }
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async createRebuke(request: RebukeCreateRequest): Promise<RebukeResponse> {
    try {
      await this.validateRequest(request);

      const createRepoRequest = this.rebukeMapper.createRebukeRequestToRepoRequest(request);
      const {createdID} = await this.rebukeRepository.createRebuke(createRepoRequest);

      const repoRequest = this.rebukeMapper.initializeGetRebukeByIdRepoRequest(createdID, request.select);
      const {data} = await this.rebukeRepository.getRebukes(repoRequest);
      return this.rebukeMapper.rebukeDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateRebuke(request: RebukeUpdateRequest): Promise<RebukeResponse> {
    try {
      const getCurrentHonorRepoRequest = this.rebukeMapper.initializeGetRebukeByIdRepoRequest(
        request.id,
        [RebukeSelectFieldsEnum.GUID, RebukeSelectFieldsEnum.IS_DELETED]
      );
      const currentHonor = await this.rebukeRepository.getRebukes(getCurrentHonorRepoRequest);

      if (!currentHonor.data.responseList?.length) {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Rebuke with id ${request.id} not exist`});
      } else if (currentHonor.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Rebuke with id ${request.id} is deleted`
        });
      } else if (currentHonor.data.responseList[0].guid !== request.guid) {
        throw new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Rebuke guid was changed'});
      }

      await this.validateRequest(request);

      const updateRepoRequest = this.rebukeMapper.updateRebukeRequestToRepoRequest(request);
      const {updatedID} = await this.rebukeRepository.updateRebuke(updateRepoRequest);

      const repoRequest = this.rebukeMapper.initializeGetRebukeByIdRepoRequest(updatedID, request.select);
      const {data} = await this.rebukeRepository.getRebukes(repoRequest);
      return this.rebukeMapper.rebukeDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deleteRebuke(id: number, guid: string): Promise<IdResponse> {
    try {
      const getCurrentHonorRepoRequest = this.rebukeMapper.initializeGetRebukeByIdRepoRequest(
        id,
        [RebukeSelectFieldsEnum.GUID, RebukeSelectFieldsEnum.IS_DELETED]
      );
      const currentHonor = await this.rebukeRepository.getRebukes(getCurrentHonorRepoRequest);

      if (!currentHonor.data.responseList?.length) {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Rebuke with id ${id} not exist`});
      } else if (currentHonor.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Rebuke with id ${id} already deleted`
        });
      } else if (currentHonor.data.responseList[0].guid !== guid) {
        throw new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Rebuke guid was changed`});
      }

      const deleteRepoRequest = this.rebukeMapper.deleteRebukeRequestToRepoRequest(id);
      const {deletedID} = await this.rebukeRepository.deleteRebuke(deleteRepoRequest);
      return {id: deletedID};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async validateRequest(request: RebukeCreateRequest) {
    //validate user
    if (!isNil(request.userId)) {
      const getUserRepoRequest = this.rebukeMapper.initializeGetUserRepoRequest(request.userId);
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