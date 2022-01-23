import {Injectable} from '@nestjs/common';
import {TeachingRankMapper} from '../mapper/teaching-rank.mapper';
import {TeachingRankGetListRequest} from '../types/request/teaching-rank-get-list.request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {TeachingRankResponse} from '../types/response/teaching-rank.response';
import {TeachingRankGetByIdRequest} from '../types/request/teaching-rank-get-by-id.request';
import {TeachingRankCreateRequest} from '../types/request/teaching-rank-create.request';
import {TeachingRankUpdateRequest} from '../types/request/teaching-rank-update.request';
import {CustomError} from '../../../common/class/custom-error';
import {ErrorCodesEnum} from '../../../common/constants/error-codes.enum';
import {TeachingRankRepository} from '../../../data-layer/repositories/teaching-rank/teaching-rank.repository';
import {TeachingRankSelectFieldsEnum} from '../../../data-layer/repositories/teaching-rank/enums/teaching-rank-select-fields.enum';

@Injectable()
export class TeachingRankService {
  constructor(
    private teachingRankRepository: TeachingRankRepository,
    private teachingRankMapper: TeachingRankMapper,
  ) {}

  async getTeachingRankList(request: TeachingRankGetListRequest): Promise<IPaginator<TeachingRankResponse>> {
    const repoRequest = this.teachingRankMapper.getTeachingRankListRequestToRepoRequest(request);
    const {data} = await this.teachingRankRepository.getTeachingRanks(repoRequest);
    return this.teachingRankMapper.teachingRankPaginatorDbModelToResponse(data);
  }

  async getTeachingRankById(request: TeachingRankGetByIdRequest): Promise<TeachingRankResponse> {
    const repoRequest = this.teachingRankMapper.getTeachingRankByIdRequestToRepoRequest(request);
    const {data} = await this.teachingRankRepository.getTeachingRanks(repoRequest);

    if (data.responseList?.length) {
      return this.teachingRankMapper.teachingRankDbModelToResponse(data.responseList[0]);
    } else {
      throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Teaching rank with id ${request.id} not exist`});
    }
  }

  async createTeachingRank(request: TeachingRankCreateRequest): Promise<TeachingRankResponse> {
    const createRepoRequest = this.teachingRankMapper.createTeachingRankRequestToRepoRequest(request);
    const {createdID} = await this.teachingRankRepository.createTeachingRank(createRepoRequest);

    const repoRequest = this.teachingRankMapper.getTeachingRankByIdRequestToRepoRequest({
      select: request.select,
      id: createdID
    });

    const {data} = await this.teachingRankRepository.getTeachingRanks(repoRequest);
    return this.teachingRankMapper.teachingRankDbModelToResponse(data.responseList[0]);
  }

  async updateTeachingRank(request: TeachingRankUpdateRequest): Promise<TeachingRankResponse> {
    const getTeachingRankRepoRequest = this.teachingRankMapper.getTeachingRankByIdRequestToRepoRequest({
      id: request.id,
      select: [TeachingRankSelectFieldsEnum.GUID, TeachingRankSelectFieldsEnum.IS_DELETED],
      showDeleted: true
    });
    const teachingRank = await this.teachingRankRepository.getTeachingRanks(getTeachingRankRepoRequest);

    if (!teachingRank.data.responseList?.length) {
      throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Teaching rank with id ${request.id} not exist`});
    } else if (teachingRank.data.responseList[0].isDeleted) {
      throw new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Teaching rank with id ${request.id} is deleted`});
    } else if (teachingRank.data.responseList[0].guid !== request.guid) {
      throw new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Teaching rank guid was changed'});
    }

    const updateRepoRequest = this.teachingRankMapper.updateTeachingRankRequestToRepoRequest(request);
    const {updatedID} = await this.teachingRankRepository.updateTeachingRank(updateRepoRequest);

    const repoRequest = this.teachingRankMapper.getTeachingRankByIdRequestToRepoRequest({
      select: request.select,
      id: updatedID
    });
    const {data} = await this.teachingRankRepository.getTeachingRanks(repoRequest);
    return this.teachingRankMapper.teachingRankDbModelToResponse(data.responseList[0]);
  }

  async deleteTeachingRank(id: number, guid: string): Promise<number> {
    const getTeachingRank = this.teachingRankMapper.getTeachingRankByIdRequestToRepoRequest({
      id: id,
      select: [TeachingRankSelectFieldsEnum.GUID, TeachingRankSelectFieldsEnum.IS_DELETED],
      showDeleted: true
    });
    const currentDepartment = await this.teachingRankRepository.getTeachingRanks(getTeachingRank);

    if (!currentDepartment.data.responseList?.length) {
      throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Teaching rank with id ${id} not exist`});
    } else if (currentDepartment.data.responseList[0].isDeleted) {
      throw new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Teaching rank with id ${id} already deleted`});
    } else if (currentDepartment.data.responseList[0].guid !== guid) {
      throw new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Teaching rank guid was changed`});
    }

    const deleteRepoRequest = this.teachingRankMapper.deleteTeachingRankRequestToRepoRequest(id);
    const {deletedID} = await this.teachingRankRepository.deleteTeachingRank(deleteRepoRequest);
    return deletedID;
  }
}
