import {Injectable} from '@nestjs/common';
import {RoleMapper} from '../mapper/role.mapper';
import {RoleGetListRequest} from '../types/request/role-get-list.request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {RoleResponse} from '../types/response/role.response';
import {RoleGetByIdRequest} from '../types/request/role-get-by-id.request';
import {CustomError} from '../../../common/class/custom-error';
import {ErrorCodesEnum} from '../../../common/constants/error-codes.enum';
import {RoleRepository} from '../../../data-layer/repositories/role/role.repository';

@Injectable()
export class RoleService {
  constructor(
    private roleRepository: RoleRepository,
    private roleMapper: RoleMapper,
  ) {}

  async getRoleList(request: RoleGetListRequest): Promise<IPaginator<RoleResponse>> {
    const repoRequest = this.roleMapper.getRoleListRequestToRepoRequest(request);
    const {data} = await this.roleRepository.getRoles(repoRequest);
    return this.roleMapper.rolePaginatorDbModelToResponse(data);
  }

  async getRoleById(request: RoleGetByIdRequest): Promise<RoleResponse> {
    const repoRequest = this.roleMapper.getRoleByIdRequestToRepoRequest(request);
    const {data} = await this.roleRepository.getRoles(repoRequest);

    if (data.responseList?.length) {
      return this.roleMapper.roleDbModelToResponse(data.responseList[0]);
    } else {
      throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Role with id ${request.id} not exist`});
    }
  }
}
