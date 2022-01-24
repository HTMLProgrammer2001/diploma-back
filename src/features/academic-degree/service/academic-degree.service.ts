import {Injectable} from '@nestjs/common';
import {AcademicDegreeMapper} from '../mapper/academic-degree.mapper';
import {AcademicDegreeGetListRequest} from '../types/request/academic-degree-get-list.request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {AcademicDegreeResponse} from '../types/response/academic-degree.response';
import {AcademicDegreeGetByIdRequest} from '../types/request/academic-degree-get-by-id.request';
import {CustomError} from '../../../common/class/custom-error';
import {ErrorCodesEnum} from '../../../common/constants/error-codes.enum';
import {AcademicDegreeRepository} from '../../../data-layer/repositories/academic-degree/academic-degree.repository';

@Injectable()
export class AcademicDegreeService {
  constructor(
    private academicDegreeRepository: AcademicDegreeRepository,
    private academicDegreeMapper: AcademicDegreeMapper,
  ) {}

  async getAcademicDegreeList(request: AcademicDegreeGetListRequest): Promise<IPaginator<AcademicDegreeResponse>> {
    const repoRequest = this.academicDegreeMapper.getAcademicDegreeListRequestToRepoRequest(request);
    const {data} = await this.academicDegreeRepository.getAcademicDegree(repoRequest);
    return this.academicDegreeMapper.academicDegreePaginatorDbModelToResponse(data);
  }

  async getAcademicDegreeById(request: AcademicDegreeGetByIdRequest): Promise<AcademicDegreeResponse> {
    const repoRequest = this.academicDegreeMapper.getAcademicDegreeByIdRequestToRepoRequest(request);
    const {data} = await this.academicDegreeRepository.getAcademicDegree(repoRequest);

    if (data.responseList?.length) {
      return this.academicDegreeMapper.academicDegreeDbModelToResponse(data.responseList[0]);
    } else {
      throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Academic degree with id ${request.id} not exist`});
    }
  }
}
