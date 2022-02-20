import {Injectable, Logger} from '@nestjs/common';
import {isNil} from 'lodash';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {IdResponse} from '../../../global/types/response/id.response';
import {RebukeRepository} from '../../../data-layer/repositories/rebuke/rebuke.repository';
import {RebukeGetListRequest} from '../types/request/rebuke-get-list.request';
import {RebukeResponse} from '../types/response/rebuke.response';
import {RebukeGetByIdRequest} from '../types/request/rebuke-get-by-id.request';
import {RebukeCreateRequest} from '../types/request/rebuke-create.request';
import {RebukeUpdateRequest} from '../types/request/rebuke-update.request';
import {RebukeSelectFieldsEnum} from '../../../data-layer/repositories/rebuke/enums/rebuke-select-fields.enum';
import {RebukeMapper} from '../mapper/rebuke.mapper';
import {TeacherRepository} from '../../../data-layer/repositories/teacher/teacher.repository';

@Injectable()
export class RebukeService {
  private logger: Logger;

  constructor(
    private rebukeRepository: RebukeRepository,
    private teacherRepository: TeacherRepository,
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
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Rebuke with id ${request.id} not exist`});
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
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Rebuke with id ${request.id} not exist`});
        this.logger.error(error);
        throw error;
      } else if (currentHonor.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Rebuke with id ${request.id} is deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentHonor.data.responseList[0].guid !== request.guid) {
        const error = new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Rebuke guid was changed'});
        this.logger.error(error);
        throw error;
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
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Rebuke with id ${id} not exist`});
        this.logger.error(error);
        throw error;
      } else if (currentHonor.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Rebuke with id ${id} already deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentHonor.data.responseList[0].guid !== guid) {
        const error = new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Rebuke guid was changed`});
        this.logger.error(error);
        throw error;
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
    if (!isNil(request.teacherId)) {
      const getTeacherRepoRequest = this.rebukeMapper.initializeGetTeacherRepoRequest(request.teacherId);
      const {data: teacherData} = await this.teacherRepository.getTeachers(getTeacherRepoRequest);

      if (!teacherData.responseList.length) {
        const error = new CustomError({
          code: ErrorCodesEnum.NOT_FOUND,
          message: `Teacher with id ${request.teacherId} not found`
        });

        this.logger.error(error);
        throw error;
      }

      if (teacherData.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Teacher with id ${request.teacherId} is deleted`
        });

        this.logger.error(error);
        throw error;
      }
    }

    //validate unique orderNumber
    if (!isNil(request.orderNumber)) {
      const getRebukeByOrderNumberRepoRequest = this.rebukeMapper.initializeGetRebukeByOrderNumberRepoRequest(request.orderNumber);
      const {data: rebukeByOrderNumberData} = await this.rebukeRepository.getRebukes(getRebukeByOrderNumberRepoRequest);

      if (rebukeByOrderNumberData.responseList.length && rebukeByOrderNumberData.responseList[0].id !== (request as any).id) {
        const error = new CustomError({
          code: ErrorCodesEnum.VALIDATION,
          message: `Rebuke with order number ${request.orderNumber} already exist`
        });

        this.logger.error(error);
        throw error;
      }
    }
  }
}
