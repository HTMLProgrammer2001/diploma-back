import {Injectable} from '@nestjs/common';
import {DepartmentMapper} from '../mapper/department.mapper';
import {DepartmentGetListRequest} from '../types/request/department-get-list.request';
import {IPaginator} from '../../../common/types/interface/IPaginator.interface';
import {DepartmentResponse} from '../types/response/department.response';
import {DepartmentGetByIdRequest} from '../types/request/department-get-by-id.request';
import {DepartmentCreateRequest} from '../types/request/department-create.request';
import {DepartmentUpdateRequest} from '../types/request/department-update.request';
import {CustomError} from '../../../common/class/custom-error';
import {ErrorCodesEnum} from '../../../common/constants/error-codes.enum';
import {DepartmentSelectFieldsEnum} from '../../../data-layer/repositories/department/enums/department-select-fields.enum';
import {DepartmentRepository} from '../../../data-layer/repositories/department/department.repository';

@Injectable()
export class DepartmentService {
  constructor(
    private departmentRepository: DepartmentRepository,
    private departmentMapper: DepartmentMapper,
  ) {}

  async getDepartmentList(request: DepartmentGetListRequest): Promise<IPaginator<DepartmentResponse>> {
    const repoRequest = this.departmentMapper.getDepartmentListRequestToRepoRequest(request);
    const {data} = await this.departmentRepository.getDepartments(repoRequest);
    return this.departmentMapper.departmentPaginatorDbModelToResponse(data);
  }

  async getDepartmentById(request: DepartmentGetByIdRequest): Promise<DepartmentResponse> {
    const repoRequest = this.departmentMapper.getDepartmentByIdRequestToRepoRequest(request);
    const {data} = await this.departmentRepository.getDepartments(repoRequest);

    if (data.responseList?.length) {
      return this.departmentMapper.departmentDbModelToResponse(data.responseList[0]);
    } else {
      throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Department with id ${request.id} not exist`});
    }
  }

  async createDepartment(request: DepartmentCreateRequest): Promise<DepartmentResponse> {
    const createRepoRequest = this.departmentMapper.createDepartmentRequestToRepoRequest(request);
    const {createdID} = await this.departmentRepository.createDepartment(createRepoRequest);

    const repoRequest = this.departmentMapper.getDepartmentByIdRequestToRepoRequest({
      select: request.select,
      id: createdID
    });

    const {data} = await this.departmentRepository.getDepartments(repoRequest);
    return this.departmentMapper.departmentDbModelToResponse(data.responseList[0]);
  }

  async updateDepartment(request: DepartmentUpdateRequest): Promise<DepartmentResponse> {
    const getCurrentDepartmentRepoRequest = this.departmentMapper.getDepartmentByIdRequestToRepoRequest({
      id: request.id,
      select: [DepartmentSelectFieldsEnum.GUID, DepartmentSelectFieldsEnum.IS_DELETED],
      showDeleted: true
    });
    const currentDepartment = await this.departmentRepository.getDepartments(getCurrentDepartmentRepoRequest);

    if (!currentDepartment.data.responseList?.length) {
      throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Department with id ${request.id} not exist`});
    } else if (currentDepartment.data.responseList[0].isDeleted) {
      throw new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Department with id ${request.id} is deleted`});
    } else if (currentDepartment.data.responseList[0].guid !== request.guid) {
      throw new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Department guid was changed'});
    }

    const updateRepoRequest = this.departmentMapper.updateDepartmentRequestToRepoRequest(request);
    const {updatedID} = await this.departmentRepository.updateDepartment(updateRepoRequest);

    const repoRequest = this.departmentMapper.getDepartmentByIdRequestToRepoRequest({
      select: request.select,
      id: updatedID
    });
    const {data} = await this.departmentRepository.getDepartments(repoRequest);
    return this.departmentMapper.departmentDbModelToResponse(data.responseList[0]);
  }

  async deleteDepartment(id: number, guid: string): Promise<number> {
    const getCurrentDepartmentRepoRequest = this.departmentMapper.getDepartmentByIdRequestToRepoRequest({
      id: id,
      select: [DepartmentSelectFieldsEnum.GUID, DepartmentSelectFieldsEnum.IS_DELETED],
      showDeleted: true
    });
    const currentDepartment = await this.departmentRepository.getDepartments(getCurrentDepartmentRepoRequest);

    if (!currentDepartment.data.responseList?.length) {
      throw new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Department with id ${id} not exist`});
    } else if (currentDepartment.data.responseList[0].isDeleted) {
      throw new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Department with id ${id} already deleted`});
    } else if (currentDepartment.data.responseList[0].guid !== guid) {
      throw new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Department guid was changed`});
    }

    const deleteRepoRequest = this.departmentMapper.deleteDepartmentRequestToRepoRequest(id);
    const {deletedID} = await this.departmentRepository.deleteDepartment(deleteRepoRequest);
    return deletedID;
  }
}
