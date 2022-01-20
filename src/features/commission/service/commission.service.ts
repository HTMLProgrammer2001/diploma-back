import {Injectable} from '@nestjs/common';
import {CommissionMapper} from '../mapper/commission.mapper';
import {CommissionGetListRequest} from '../types/request/commission-get-list.request';
import {CommissionRepository} from '../../../data/repositories/commission/commission.repository';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {CommissionResponse} from '../types/response/commission.response';
import {CommissionGetByIdRequest} from '../types/request/commission-get-by-id.request';
import {CommissionCreateRequest} from '../types/request/commission-create.request';
import {CommissionUpdateRequest} from '../types/request/commission-update.request';
import {CommissionSelectFieldsEnum} from '../../../data/repositories/commission/enums/commission-select-fields.enum';

@Injectable()
export class CommissionService {
  constructor(
    private commissionRepository: CommissionRepository,
    private commissionMapper: CommissionMapper,
  ) {
  }

  async getCommissionList(request: CommissionGetListRequest): Promise<IPaginator<CommissionResponse>> {
    const repoRequest = this.commissionMapper.getCommissionListRequestToRepoRequest(request);
    const {data} = await this.commissionRepository.getCommissionList(repoRequest);
    return this.commissionMapper.commissionPaginatorDbModelToResponse(data);
  }

  async getCommissionById(request: CommissionGetByIdRequest): Promise<CommissionResponse> {
    const repoRequest = this.commissionMapper.getCommissionByIdRequestToRepoRequest(request);
    const {data} = await this.commissionRepository.getCommissionList(repoRequest);

    if (data.responseList?.length) {
      return this.commissionMapper.commissionDbModelToResponse(data.responseList[0]);
    } else {
      throw new Error(`Commission with id ${request.id} not exist`);
    }
  }

  async createCommission(request: CommissionCreateRequest): Promise<CommissionResponse> {
    const createRepoRequest = this.commissionMapper.createCommissionRequestToRepoRequest(request);
    const {createdID} = await this.commissionRepository.createCommission(createRepoRequest);

    const repoRequest = this.commissionMapper.getCommissionByIdRequestToRepoRequest({
      select: request.select,
      id: createdID
    });
    const {data} = await this.commissionRepository.getCommissionList(repoRequest);
    return this.commissionMapper.commissionDbModelToResponse(data.responseList[0]);
  }

  async updateCommission(request: CommissionUpdateRequest): Promise<CommissionResponse> {
    const getCurrentCommissionRepoRequest = this.commissionMapper.getCommissionByIdRequestToRepoRequest({
      id: request.id,
      select: [CommissionSelectFieldsEnum.GUID, CommissionSelectFieldsEnum.IS_DELETED],
      showDeleted: true
    });
    const currentCommission = await this.commissionRepository.getCommissionList(getCurrentCommissionRepoRequest);

    if (!currentCommission.data.responseList?.length) {
      throw new Error(`Commission with id ${request.id} not exist`);
    } else if (currentCommission.data.responseList[0].guid !== request.guid) {
      throw new Error(`Commission guid was changed`);
    } else if (currentCommission.data.responseList[0].isDeleted) {
      throw new Error(`Commission with id ${request.id} is deleted`);
    }

    const updateRepoRequest = this.commissionMapper.updateCommissionRequestToRepoRequest(request);
    const {updatedID} = await this.commissionRepository.updateCommission(updateRepoRequest);

    const repoRequest = this.commissionMapper.getCommissionByIdRequestToRepoRequest({
      select: request.select,
      id: updatedID
    });
    const {data} = await this.commissionRepository.getCommissionList(repoRequest);
    return this.commissionMapper.commissionDbModelToResponse(data.responseList[0]);
  }

  async deleteCommission(id: number): Promise<number> {
    const deleteRepoRequest = this.commissionMapper.deleteCommissionRequestToRepoRequest(id);
    const {deletedID} = await this.commissionRepository.deleteCommission(deleteRepoRequest);
    return deletedID;
  }
}
