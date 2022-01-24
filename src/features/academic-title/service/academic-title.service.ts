import {Injectable} from '@nestjs/common';
import {AcademicTitleMapper} from '../mapper/academic-title.mapper';
import {AcademicTitleGetListRequest} from '../types/request/academic-title-get-list.request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {AcademicTitleResponse} from '../types/response/academic-title.response';
import {AcademicTitleGetByIdRequest} from '../types/request/academic-title-get-by-id.request';
import {CustomError} from '../../../common/class/custom-error';
import {ErrorCodesEnum} from '../../../common/constants/error-codes.enum';
import {AcademicDegreeRepository} from '../../../data-layer/repositories/academic-degree/academic-degree.repository';
import {AcademicTitleRepository} from '../../../data-layer/repositories/academic-title/academic-title.repository';

@Injectable()
export class AcademicTitleService {
  constructor(
    private academicTitleRepository: AcademicTitleRepository,
    private academicTitleMapper: AcademicTitleMapper,
  ) {}

  async getAcademicTitleList(request: AcademicTitleGetListRequest): Promise<IPaginator<AcademicTitleResponse>> {
    const repoRequest = this.academicTitleMapper.getAcademicTitleListRequestToRepoRequest(request);
    const {data} = await this.academicTitleRepository.getAcademicTitle(repoRequest);
    return this.academicTitleMapper.academicTitlePaginatorDbModelToResponse(data);
  }

  async getAcademicTitleById(request: AcademicTitleGetByIdRequest): Promise<AcademicTitleResponse> {
    const repoRequest = this.academicTitleMapper.getAcademicTitleByIdRequestToRepoRequest(request);
    const {data} = await this.academicTitleRepository.getAcademicTitle(repoRequest);

    if (data.responseList?.length) {
      return this.academicTitleMapper.academicTitleDbModelToResponse(data.responseList[0]);
    } else {
      throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Academic title with id ${request.id} not exist`});
    }
  }
}
