import {Injectable, Logger} from '@nestjs/common';
import {AcademicTitleMapper} from '../mapper/academic-title.mapper';
import {AcademicTitleGetListRequest} from '../types/request/academic-title-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {AcademicTitleResponse} from '../types/response/academic-title.response';
import {AcademicTitleGetByIdRequest} from '../types/request/academic-title-get-by-id.request';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {AcademicTitleRepository} from '../../../data-layer/repositories/academic-title/academic-title.repository';
import {AcademicTitleCreateRequest} from '../types/request/academic-title-create.request';
import {AcademicTitleUpdateRequest} from '../types/request/academic-title-update.request';
import {AcademicTitleSelectFieldsEnum} from '../../../data-layer/repositories/academic-title/enums/academic-title-select-fields.enum';
import {IdResponse} from '../../../global/types/response/id.response';

@Injectable()
export class AcademicTitleService {
  private logger: Logger;

  constructor(
    private academicTitleRepository: AcademicTitleRepository,
    private academicTitleMapper: AcademicTitleMapper,
  ) {
    this.logger = new Logger(AcademicTitleService.name);
  }

  async getAcademicTitleList(request: AcademicTitleGetListRequest): Promise<IPaginator<AcademicTitleResponse>> {
    try {
      const repoRequest = this.academicTitleMapper.getAcademicTitleListRequestToRepoRequest(request);
      const {data} = await this.academicTitleRepository.getAcademicTitle(repoRequest);
      return this.academicTitleMapper.academicTitlePaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getAcademicTitleById(request: AcademicTitleGetByIdRequest): Promise<AcademicTitleResponse> {
    const repoRequest = this.academicTitleMapper.getAcademicTitleByIdRequestToRepoRequest(request);
    const {data} = await this.academicTitleRepository.getAcademicTitle(repoRequest);

    if (data.responseList?.length) {
      return this.academicTitleMapper.academicTitleDbModelToResponse(data.responseList[0]);
    } else {
      const error = new CustomError({
        code: ErrorCodesEnum.NOT_FOUND,
        message: `Academic title with id ${request.id} not exist`
      });

      this.logger.error(error);
      throw error;
    }
  }

  async createAcademicTitle(request: AcademicTitleCreateRequest): Promise<AcademicTitleResponse> {
    try {
      const createRepoRequest = this.academicTitleMapper.createAcademicTitleRequestToRepoRequest(request);
      const {createdID} = await this.academicTitleRepository.createAcademicTitle(createRepoRequest);

      const repoRequest = this.academicTitleMapper.initializeAcademicTitleGetByIdRepoRequest(createdID, request.select);
      const {data} = await this.academicTitleRepository.getAcademicTitle(repoRequest);
      return this.academicTitleMapper.academicTitleDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateAcademicTitle(request: AcademicTitleUpdateRequest): Promise<AcademicTitleResponse> {
    try {
      const getCurrentAcademicTitleRepoRequest = this.academicTitleMapper.initializeAcademicTitleGetByIdRepoRequest(
        request.id,
        [AcademicTitleSelectFieldsEnum.GUID, AcademicTitleSelectFieldsEnum.IS_DELETED]
      );

      const currentAcademicTitle = await this.academicTitleRepository.getAcademicTitle(getCurrentAcademicTitleRepoRequest);

      if (!currentAcademicTitle.data.responseList?.length) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Academic title with id ${request.id} not exist`
        });

        this.logger.error(error);
        throw error;
      } else if (currentAcademicTitle.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Academic title with id ${request.id} is deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentAcademicTitle.data.responseList[0].guid !== request.guid) {
        const error = new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Academic title guid was changed'});

        this.logger.error(error);
        throw error;
      }

      const updateRepoRequest = this.academicTitleMapper.updateAcademicTitleRequestToRepoRequest(request);
      const {updatedID} = await this.academicTitleRepository.updateAcademicTitle(updateRepoRequest);

      const repoRequest = this.academicTitleMapper.initializeAcademicTitleGetByIdRepoRequest(updatedID, request.select);
      const {data} = await this.academicTitleRepository.getAcademicTitle(repoRequest);
      return this.academicTitleMapper.academicTitleDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deleteAcademicTitle(id: number, guid: string): Promise<IdResponse> {
    try {
      const getCurrentAcademicTitleRepoRequest = this.academicTitleMapper.initializeAcademicTitleGetByIdRepoRequest(
        id,
        [AcademicTitleSelectFieldsEnum.GUID, AcademicTitleSelectFieldsEnum.IS_DELETED]
      );

      const currentAcademicTitle = await this.academicTitleRepository.getAcademicTitle(getCurrentAcademicTitleRepoRequest);

      if (!currentAcademicTitle.data.responseList?.length) {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Academic title with id ${id} not exist`});

        this.logger.error(error);
        throw error;
      } else if (currentAcademicTitle.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Academic title with id ${id} already deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentAcademicTitle.data.responseList[0].guid !== guid) {
        const error = new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Academic title guid was changed`});

        this.logger.error(error);
        throw error;
      }

      const deleteRepoRequest = this.academicTitleMapper.deleteAcademicTitleRequestToRepoRequest(id);
      const {deletedID} = await this.academicTitleRepository.deleteAcademicTitle(deleteRepoRequest);
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
