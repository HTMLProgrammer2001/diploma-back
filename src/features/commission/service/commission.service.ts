import {Injectable, Logger} from '@nestjs/common';
import {CommissionMapper} from '../mapper/commission.mapper';
import {CommissionGetListRequest} from '../types/request/commission-get-list.request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {CommissionResponse} from '../types/response/commission.response';
import {CommissionGetByIdRequest} from '../types/request/commission-get-by-id.request';
import {CommissionCreateRequest} from '../types/request/commission-create.request';
import {CommissionUpdateRequest} from '../types/request/commission-update.request';
import {CustomError} from '../../../common/class/custom-error';
import {ErrorCodesEnum} from '../../../common/constants/error-codes.enum';
import {CommissionRepository} from '../../../data-layer/repositories/commission/commission.repository';
import {CommissionSelectFieldsEnum} from '../../../data-layer/repositories/commission/enums/commission-select-fields.enum';

@Injectable()
export class CommissionService {
  private logger: Logger;

  constructor(
    private commissionRepository: CommissionRepository,
    private commissionMapper: CommissionMapper,
  ) {
    this.logger = new Logger(CommissionService.name);
  }

  async getCommissionList(request: CommissionGetListRequest): Promise<IPaginator<CommissionResponse>> {
    try {
      const repoRequest = this.commissionMapper.getCommissionListRequestToRepoRequest(request);
      const {data} = await this.commissionRepository.getCommissions(repoRequest);
      return this.commissionMapper.commissionPaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getCommissionById(request: CommissionGetByIdRequest): Promise<CommissionResponse> {
    try {
      const repoRequest = this.commissionMapper.getCommissionByIdRequestToRepoRequest(request);
      const {data} = await this.commissionRepository.getCommissions(repoRequest);

      if (data.responseList?.length) {
        return this.commissionMapper.commissionDbModelToResponse(data.responseList[0]);
      } else {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Commission with id ${request.id} not exist`});
      }
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async createCommission(request: CommissionCreateRequest): Promise<CommissionResponse> {
    try {
      const createRepoRequest = this.commissionMapper.createCommissionRequestToRepoRequest(request);
      const {createdID} = await this.commissionRepository.createCommission(createRepoRequest);

      const repoRequest = this.commissionMapper.initializeGetCommissionByIdRepoRequest(createdID, request.select);
      const {data} = await this.commissionRepository.getCommissions(repoRequest);
      return this.commissionMapper.commissionDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateCommission(request: CommissionUpdateRequest): Promise<CommissionResponse> {
    try {
      const getCurrentCommissionRepoRequest = this.commissionMapper.initializeGetCommissionByIdRepoRequest(
        request.id,
        [CommissionSelectFieldsEnum.GUID, CommissionSelectFieldsEnum.IS_DELETED],
      );
      const currentCommission = await this.commissionRepository.getCommissions(getCurrentCommissionRepoRequest);

      if (!currentCommission.data.responseList?.length) {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Commission with id ${request.id} not exist`});
      } else if (currentCommission.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Commission with id ${request.id} is deleted`
        });
      } else if (currentCommission.data.responseList[0].guid !== request.guid) {
        throw new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Commission guid was changed'});
      }

      const updateRepoRequest = this.commissionMapper.updateCommissionRequestToRepoRequest(request);
      const {updatedID} = await this.commissionRepository.updateCommission(updateRepoRequest);

      const repoRequest = this.commissionMapper.initializeGetCommissionByIdRepoRequest(updatedID, request.select);
      const {data} = await this.commissionRepository.getCommissions(repoRequest);
      return this.commissionMapper.commissionDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deleteCommission(id: number, guid: string): Promise<number> {
    try {
      const getCurrentCommissionRepoRequest = this.commissionMapper.initializeGetCommissionByIdRepoRequest(
        id,
        [CommissionSelectFieldsEnum.GUID, CommissionSelectFieldsEnum.IS_DELETED],
      );
      const currentCommission = await this.commissionRepository.getCommissions(getCurrentCommissionRepoRequest);

      if (!currentCommission.data.responseList?.length) {
        throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Commission with id ${id} not exist`});
      } else if (currentCommission.data.responseList[0].isDeleted) {
        throw new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Commission with id ${id} already deleted`
        });
      } else if (currentCommission.data.responseList[0].guid !== guid) {
        throw new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Commission guid was changed`});
      }

      const deleteRepoRequest = this.commissionMapper.deleteCommissionRequestToRepoRequest(id);
      const {deletedID} = await this.commissionRepository.deleteCommission(deleteRepoRequest);
      return deletedID;
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }
}
