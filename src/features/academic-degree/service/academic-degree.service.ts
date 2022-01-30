import {Injectable, Logger} from '@nestjs/common';
import {AcademicDegreeMapper} from '../mapper/academic-degree.mapper';
import {AcademicDegreeGetListRequest} from '../types/request/academic-degree-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {AcademicDegreeResponse} from '../types/response/academic-degree.response';
import {AcademicDegreeGetByIdRequest} from '../types/request/academic-degree-get-by-id.request';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {AcademicDegreeRepository} from '../../../data-layer/repositories/academic-degree/academic-degree.repository';
import {AcademicDegreeCreateRequest} from '../types/request/academic-degree-create.request';
import {AcademicDegreeUpdateRequest} from '../types/request/academic-degree-update.request';
import {AcademicDegreeSelectFieldsEnum} from '../../../data-layer/repositories/academic-degree/enums/academic-degree-select-fields.enum';
import {IdResponse} from '../../../global/types/response/id.response';

@Injectable()
export class AcademicDegreeService {
  private logger: Logger;

  constructor(
    private academicDegreeRepository: AcademicDegreeRepository,
    private academicDegreeMapper: AcademicDegreeMapper,
  ) {
    this.logger = new Logger(AcademicDegreeService.name);
  }

  async getAcademicDegreeList(request: AcademicDegreeGetListRequest): Promise<IPaginator<AcademicDegreeResponse>> {
    try {
      const repoRequest = this.academicDegreeMapper.getAcademicDegreeListRequestToRepoRequest(request);
      const {data} = await this.academicDegreeRepository.getAcademicDegree(repoRequest);
      return this.academicDegreeMapper.academicDegreePaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getAcademicDegreeById(request: AcademicDegreeGetByIdRequest): Promise<AcademicDegreeResponse> {
    try {
      const repoRequest = this.academicDegreeMapper.getAcademicDegreeByIdRequestToRepoRequest(request);
      const {data} = await this.academicDegreeRepository.getAcademicDegree(repoRequest);

      if (data.responseList?.length) {
        return this.academicDegreeMapper.academicDegreeDbModelToResponse(data.responseList[0]);
      } else {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Academic degree with id ${request.id} not exist`
        });
      }
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async createAcademicDegree(request: AcademicDegreeCreateRequest): Promise<AcademicDegreeResponse> {
    try {
      const createRepoRequest = this.academicDegreeMapper.createAcademicDegreeRequestToRepoRequest(request);
      const {createdID} = await this.academicDegreeRepository.createAcademicDegree(createRepoRequest);

      const repoRequest = this.academicDegreeMapper.initializeAcademicDegreeGetByIdRepoRequest(createdID, request.select);
      const {data} = await this.academicDegreeRepository.getAcademicDegree(repoRequest);
      return this.academicDegreeMapper.academicDegreeDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateAcademicDegree(request: AcademicDegreeUpdateRequest): Promise<AcademicDegreeResponse> {
    try {
      const getCurrentAcademicDegreeRepoRequest = this.academicDegreeMapper.initializeAcademicDegreeGetByIdRepoRequest(
        request.id,
        [AcademicDegreeSelectFieldsEnum.GUID, AcademicDegreeSelectFieldsEnum.IS_DELETED]
      );

      const currentAcademicDegree = await this.academicDegreeRepository.getAcademicDegree(getCurrentAcademicDegreeRepoRequest);

      if (!currentAcademicDegree.data.responseList?.length) {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Academic degree with id ${request.id} not exist`
        });
      } else if (currentAcademicDegree.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Academic degree with id ${request.id} is deleted`
        });
      } else if (currentAcademicDegree.data.responseList[0].guid !== request.guid) {
        throw new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Academic degree guid was changed'});
      }

      const updateRepoRequest = this.academicDegreeMapper.updateAcademicDegreeRequestToRepoRequest(request);
      const {updatedID} = await this.academicDegreeRepository.updateAcademicDegree(updateRepoRequest);

      const repoRequest = this.academicDegreeMapper.initializeAcademicDegreeGetByIdRepoRequest(updatedID, request.select);
      const {data} = await this.academicDegreeRepository.getAcademicDegree(repoRequest);
      return this.academicDegreeMapper.academicDegreeDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deleteAcademicDegree(id: number, guid: string): Promise<IdResponse> {
    try {
      const getCurrentAcademicDegreeRepoRequest = this.academicDegreeMapper.initializeAcademicDegreeGetByIdRepoRequest(
        id,
        [AcademicDegreeSelectFieldsEnum.GUID, AcademicDegreeSelectFieldsEnum.IS_DELETED]
      );

      const currentAcademicDegree = await this.academicDegreeRepository.getAcademicDegree(getCurrentAcademicDegreeRepoRequest);

      if (!currentAcademicDegree.data.responseList?.length) {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Academic degree with id ${id} not exist`});
      } else if (currentAcademicDegree.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Academic degree with id ${id} already deleted`
        });
      } else if (currentAcademicDegree.data.responseList[0].guid !== guid) {
        throw new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Academic degree guid was changed`});
      }

      const deleteRepoRequest = this.academicDegreeMapper.deleteAcademicDegreeRequestToRepoRequest(id);
      const {deletedID} = await this.academicDegreeRepository.deleteAcademicDegree(deleteRepoRequest);
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
