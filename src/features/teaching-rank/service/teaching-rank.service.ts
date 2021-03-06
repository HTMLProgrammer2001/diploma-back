import {Injectable, Logger} from '@nestjs/common';
import {TeachingRankMapper} from '../mapper/teaching-rank.mapper';
import {TeachingRankGetListRequest} from '../types/request/teaching-rank-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {TeachingRankResponse} from '../types/response/teaching-rank.response';
import {TeachingRankGetByIdRequest} from '../types/request/teaching-rank-get-by-id.request';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {TeachingRankRepository} from '../../../data-layer/repositories/teaching-rank/teaching-rank.repository';
import {TeachingRankCreateRequest} from '../types/request/teaching-rank-create.request';
import {TeachingRankUpdateRequest} from '../types/request/teaching-rank-update.request';
import {TeachingRankSelectFieldsEnum} from '../../../data-layer/repositories/teaching-rank/enums/teaching-rank-select-fields.enum';
import {IdResponse} from '../../../global/types/response/id.response';

@Injectable()
export class TeachingRankService {
  private logger: Logger;

  constructor(
    private teachingRankRepository: TeachingRankRepository,
    private teachingRankMapper: TeachingRankMapper,
  ) {
    this.logger = new Logger(TeachingRankService.name);
  }

  async getTeachingRankList(request: TeachingRankGetListRequest): Promise<IPaginator<TeachingRankResponse>> {
    try {
      const repoRequest = this.teachingRankMapper.getTeachingRankListRequestToRepoRequest(request);
      const {data} = await this.teachingRankRepository.getTeachingRanks(repoRequest);
      return this.teachingRankMapper.teachingRankPaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getTeachingRankById(request: TeachingRankGetByIdRequest): Promise<TeachingRankResponse> {
    try {
      const repoRequest = this.teachingRankMapper.getTeachingRankByIdRequestToRepoRequest(request);
      const {data} = await this.teachingRankRepository.getTeachingRanks(repoRequest);

      if (data.responseList?.length) {
        return this.teachingRankMapper.teachingRankDbModelToResponse(data.responseList[0]);
      } else {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Teaching rank with id ${request.id} not exist`
        });

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

  async createTeachingRank(request: TeachingRankCreateRequest): Promise<TeachingRankResponse> {
    try {
      const createRepoRequest = this.teachingRankMapper.createTeachingRankRequestToRepoRequest(request);
      const {createdID} = await this.teachingRankRepository.createTeachingRank(createRepoRequest);

      const repoRequest = this.teachingRankMapper.initializeTeachingRankByIdRepoRequest(
        createdID,
        request.select
      );

      const {data} = await this.teachingRankRepository.getTeachingRanks(repoRequest);
      return this.teachingRankMapper.teachingRankDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateTeachingRank(request: TeachingRankUpdateRequest): Promise<TeachingRankResponse> {
    try {
      const getCurrentTeachingRankRepoRequest = this.teachingRankMapper.initializeTeachingRankByIdRepoRequest(
        request.id,
        [TeachingRankSelectFieldsEnum.GUID, TeachingRankSelectFieldsEnum.IS_DELETED]
      );
      const currentTeachingRank = await this.teachingRankRepository.getTeachingRanks(getCurrentTeachingRankRepoRequest);

      if (!currentTeachingRank.data.responseList?.length) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Teaching rank with id ${request.id} not exist`
        });

        this.logger.error(error);
        throw error;
      } else if (currentTeachingRank.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Teaching rank with id ${request.id} is deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentTeachingRank.data.responseList[0].guid !== request.guid) {
        const error = new CustomError({
          code: ErrorCodesEnum.GUID_CHANGED,
          message: 'Teaching rank guid was changed'
        });

        this.logger.error(error);
        throw error;
      }

      const updateRepoRequest = this.teachingRankMapper.updateTeachingRankRequestToRepoRequest(request);
      const {updatedID} = await this.teachingRankRepository.updateTeachingRank(updateRepoRequest);

      const repoRequest = this.teachingRankMapper.initializeTeachingRankByIdRepoRequest(updatedID, request.select);
      const {data} = await this.teachingRankRepository.getTeachingRanks(repoRequest);
      return this.teachingRankMapper.teachingRankDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deleteTeachingRank(id: number, guid: string): Promise<IdResponse> {
    try {
      const getCurrentTeachingRankRepoRequest = this.teachingRankMapper.initializeTeachingRankByIdRepoRequest(
        id,
        [TeachingRankSelectFieldsEnum.GUID, TeachingRankSelectFieldsEnum.IS_DELETED]
      );
      const currentTeachingRank = await this.teachingRankRepository.getTeachingRanks(getCurrentTeachingRankRepoRequest);

      if (!currentTeachingRank.data.responseList?.length) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Teaching rank with id ${id} not exist`
        });

        this.logger.error(error);
        throw error;
      } else if (currentTeachingRank.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Teaching rank with id ${id} already deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentTeachingRank.data.responseList[0].guid !== guid) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Teaching rank guid was changed`
        });

        this.logger.error(error);
        throw error;
      }

      const deleteRepoRequest = this.teachingRankMapper.deleteTeachingRankRequestToRepoRequest(id);
      const {deletedID} = await this.teachingRankRepository.deleteTeachingRank(deleteRepoRequest);
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
