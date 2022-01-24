import {Injectable} from '@nestjs/common';
import {TeachingRankMapper} from '../mapper/teaching-rank.mapper';
import {TeachingRankGetListRequest} from '../types/request/teaching-rank-get-list.request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {TeachingRankResponse} from '../types/response/teaching-rank.response';
import {TeachingRankGetByIdRequest} from '../types/request/teaching-rank-get-by-id.request';
import {CustomError} from '../../../common/class/custom-error';
import {ErrorCodesEnum} from '../../../common/constants/error-codes.enum';
import {TeachingRankRepository} from '../../../data-layer/repositories/teaching-rank/teaching-rank.repository';

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
}
