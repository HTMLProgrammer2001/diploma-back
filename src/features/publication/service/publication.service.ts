import {Injectable, Logger} from '@nestjs/common';
import {difference, isNil} from 'lodash';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {IdResponse} from '../../../global/types/response/id.response';
import {PublicationRepository} from '../../../data-layer/repositories/publication/publication.repository';
import {PublicationGetListRequest} from '../types/request/publication-get-list.request';
import {PublicationResponse} from '../types/response/publication.response';
import {PublicationMapper} from '../mapper/publication.mapper';
import {PublicationGetByIdRequest} from '../types/request/publication-get-by-id.request';
import {PublicationCreateRequest} from '../types/request/publication-create.request';
import {PublicationUpdateRequest} from '../types/request/publication-update.request';
import {PublicationSelectFieldsEnum} from '../../../data-layer/repositories/publication/enums/publication-select-fields.enum';
import {UserRepository} from '../../../data-layer/repositories/user/user.repository';
import {TeacherRepository} from '../../../data-layer/repositories/teacher/teacher.repository';

@Injectable()
export class PublicationService {
  private logger: Logger;

  constructor(
    private publicationRepository: PublicationRepository,
    private teacherRepository: TeacherRepository,
    private publicationMapper: PublicationMapper,
  ) {
    this.logger = new Logger(PublicationService.name);
  }

  async getPublicationList(request: PublicationGetListRequest): Promise<IPaginator<PublicationResponse>> {
    try {
      const repoRequest = this.publicationMapper.getPublicationListRequestToRepoRequest(request);
      const {data} = await this.publicationRepository.getPublications(repoRequest);
      return this.publicationMapper.publicationPaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getPublicationById(request: PublicationGetByIdRequest): Promise<PublicationResponse> {
    try {
      const repoRequest = this.publicationMapper.getPublicationByIdRequestToRepoRequest(request);
      const {data} = await this.publicationRepository.getPublications(repoRequest);

      if (data.responseList?.length) {
        return this.publicationMapper.publicationDbModelToResponse(data.responseList[0]);
      } else {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Publication with id ${request.id} not exist`});
      }
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async createPublication(request: PublicationCreateRequest): Promise<PublicationResponse> {
    try {
      await this.validateRequest(request);

      const createRepoRequest = this.publicationMapper.createPublicationRequestToRepoRequest(request);
      const {createdID} = await this.publicationRepository.createPublication(createRepoRequest);

      const repoRequest = this.publicationMapper.initializeGetPublicationByIdRepoRequest(createdID, request.select);
      const {data} = await this.publicationRepository.getPublications(repoRequest);
      return this.publicationMapper.publicationDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updatePublication(request: PublicationUpdateRequest): Promise<PublicationResponse> {
    try {
      const getCurrentPublicationRepoRequest = this.publicationMapper.initializeGetPublicationByIdRepoRequest(
        request.id,
        [PublicationSelectFieldsEnum.GUID, PublicationSelectFieldsEnum.IS_DELETED]
      );
      const currentPublication = await this.publicationRepository.getPublications(getCurrentPublicationRepoRequest);

      if (!currentPublication.data.responseList?.length) {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Publication with id ${request.id} not exist`});
      } else if (currentPublication.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Publication with id ${request.id} is deleted`
        });
      } else if (currentPublication.data.responseList[0].guid !== request.guid) {
        throw new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Publication guid was changed'});
      }

      await this.validateRequest(request);

      const updateRepoRequest = this.publicationMapper.updatePublicationRequestToRepoRequest(request);
      const {updatedID} = await this.publicationRepository.updatePublication(updateRepoRequest);

      const repoRequest = this.publicationMapper.initializeGetPublicationByIdRepoRequest(updatedID, request.select);
      const {data} = await this.publicationRepository.getPublications(repoRequest);
      return this.publicationMapper.publicationDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deletePublication(id: number, guid: string): Promise<IdResponse> {
    try {
      const getCurrentPublicationRepoRequest = this.publicationMapper.initializeGetPublicationByIdRepoRequest(
        id,
        [PublicationSelectFieldsEnum.GUID, PublicationSelectFieldsEnum.IS_DELETED]
      );
      const currentPublication = await this.publicationRepository.getPublications(getCurrentPublicationRepoRequest);

      if (!currentPublication.data.responseList?.length) {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Publication with id ${id} not exist`});
      } else if (currentPublication.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Publication with id ${id} already deleted`
        });
      } else if (currentPublication.data.responseList[0].guid !== guid) {
        throw new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Publication guid was changed`});
      }

      const deleteRepoRequest = this.publicationMapper.deletePublicationRequestToRepoRequest(id);
      const {deletedID} = await this.publicationRepository.deletePublication(deleteRepoRequest);
      return {id: deletedID};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async validateRequest(request: PublicationCreateRequest) {
    //validate users
    if (!isNil(request.teacherIds)) {
      const getTeachersRepoRequest = this.publicationMapper.initializeGetTeachersRepoRequest(request.teacherIds);
      const {data: teachersData} = await this.teacherRepository.getTeachers(getTeachersRepoRequest);

      const redundantTeachers = difference(request.teacherIds, teachersData.responseList.map(el => el.id));

      if (redundantTeachers.length) {
        throw new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Teachers with ids ${redundantTeachers} not found`
        });
      }

      const deletedTeachers = teachersData.responseList.filter(el => el.isDeleted).map(el => el.id);

      if (deletedTeachers.length) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Teachers with ids ${deletedTeachers} is deleted`
        });
      }
    }
  }
}
