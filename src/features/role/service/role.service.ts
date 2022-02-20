import {Injectable, Logger} from '@nestjs/common';
import {RoleMapper} from '../mapper/role.mapper';
import {RoleGetListRequest} from '../types/request/role-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {RoleResponse} from '../types/response/role.response';
import {RoleGetByIdRequest} from '../types/request/role-get-by-id.request';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {RoleRepository} from '../../../data-layer/repositories/role/role.repository';
import {RoleUpdateRequest} from '../types/request/role-update.request';
import {RoleSelectFieldsEnum} from '../../../data-layer/repositories/role/enums/role-select-fields.enum';

@Injectable()
export class RoleService {
  private logger: Logger;

  constructor(
    private roleRepository: RoleRepository,
    private roleMapper: RoleMapper,
  ) {
    this.logger = new Logger(RoleService.name);
  }

  async getRoleList(request: RoleGetListRequest): Promise<IPaginator<RoleResponse>> {
    try {
      const repoRequest = this.roleMapper.getRoleListRequestToRepoRequest(request);
      const {data} = await this.roleRepository.getRoles(repoRequest);
      return this.roleMapper.rolePaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getRoleById(request: RoleGetByIdRequest): Promise<RoleResponse> {
    try {
      const repoRequest = this.roleMapper.getRoleByIdRequestToRepoRequest(request);
      const {data} = await this.roleRepository.getRoles(repoRequest);

      if (data.responseList?.length) {
        return this.roleMapper.roleDbModelToResponse(data.responseList[0]);
      } else {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Role with id ${request.id} not exist`});
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

  async updateRole(request: RoleUpdateRequest): Promise<RoleResponse> {
    try {
      const getCurrentRepoRequest = this.roleMapper.initializeRoleRepoRequest(request.id, [RoleSelectFieldsEnum.GUID]);
      const currentRole = await this.roleRepository.getRoles(getCurrentRepoRequest);

      if (!currentRole.data.responseList?.length) {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Role with id ${request.id} not exist`});
        this.logger.error(error);
        throw error;
      } else if (currentRole.data.responseList[0].guid !== request.guid) {
        const error = new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Role guid was changed'});
        this.logger.error(error);
        throw error;
      }

      const updateRepoRequest = this.roleMapper.updateRoleRequestToRepoRequest(request);
      const {updatedID} = await this.roleRepository.updateRole(updateRepoRequest);

      const repoRequest = this.roleMapper.initializeRoleRepoRequest(updatedID, request.select);
      const {data} = await this.roleRepository.getRoles(repoRequest);
      return this.roleMapper.roleDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }
}
