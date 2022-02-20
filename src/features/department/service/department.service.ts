import {Injectable, Logger} from '@nestjs/common';
import {DepartmentMapper} from '../mapper/department.mapper';
import {DepartmentGetListRequest} from '../types/request/department-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {DepartmentResponse} from '../types/response/department.response';
import {DepartmentGetByIdRequest} from '../types/request/department-get-by-id.request';
import {DepartmentCreateRequest} from '../types/request/department-create.request';
import {DepartmentUpdateRequest} from '../types/request/department-update.request';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {DepartmentSelectFieldsEnum} from '../../../data-layer/repositories/department/enums/department-select-fields.enum';
import {DepartmentRepository} from '../../../data-layer/repositories/department/department.repository';
import {IdResponse} from '../../../global/types/response/id.response';

@Injectable()
export class DepartmentService {
  private logger: Logger;

  constructor(
    private departmentRepository: DepartmentRepository,
    private departmentMapper: DepartmentMapper,
  ) {
    this.logger = new Logger(DepartmentService.name);
  }

  async getDepartmentList(request: DepartmentGetListRequest): Promise<IPaginator<DepartmentResponse>> {
    try {
      const repoRequest = this.departmentMapper.getDepartmentListRequestToRepoRequest(request);
      const {data} = await this.departmentRepository.getDepartments(repoRequest);
      return this.departmentMapper.departmentPaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getDepartmentById(request: DepartmentGetByIdRequest): Promise<DepartmentResponse> {
    try {
      const repoRequest = this.departmentMapper.getDepartmentByIdRequestToRepoRequest(request);
      const {data} = await this.departmentRepository.getDepartments(repoRequest);

      if (data.responseList?.length) {
        return this.departmentMapper.departmentDbModelToResponse(data.responseList[0]);
      } else {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Department with id ${request.id} not exist`});
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

  async createDepartment(request: DepartmentCreateRequest): Promise<DepartmentResponse> {
    try {
      const createRepoRequest = this.departmentMapper.createDepartmentRequestToRepoRequest(request);
      const {createdID} = await this.departmentRepository.createDepartment(createRepoRequest);

      const repoRequest = this.departmentMapper.initializeDepartmentByIdRepoRequest(
        createdID,
        request.select
      );

      const {data} = await this.departmentRepository.getDepartments(repoRequest);
      return this.departmentMapper.departmentDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateDepartment(request: DepartmentUpdateRequest): Promise<DepartmentResponse> {
    try {
      const getCurrentDepartmentRepoRequest = this.departmentMapper.initializeDepartmentByIdRepoRequest(
        request.id,
        [DepartmentSelectFieldsEnum.GUID, DepartmentSelectFieldsEnum.IS_DELETED]
      );
      const currentDepartment = await this.departmentRepository.getDepartments(getCurrentDepartmentRepoRequest);

      if (!currentDepartment.data.responseList?.length) {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Department with id ${request.id} not exist`});
        this.logger.error(error);
        throw error;
      } else if (currentDepartment.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Department with id ${request.id} is deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentDepartment.data.responseList[0].guid !== request.guid) {
        const error = new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Department guid was changed'});
        this.logger.error(error);
        throw error;
      }

      const updateRepoRequest = this.departmentMapper.updateDepartmentRequestToRepoRequest(request);
      const {updatedID} = await this.departmentRepository.updateDepartment(updateRepoRequest);

      const repoRequest = this.departmentMapper.initializeDepartmentByIdRepoRequest(updatedID, request.select);
      const {data} = await this.departmentRepository.getDepartments(repoRequest);
      return this.departmentMapper.departmentDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async deleteDepartment(id: number, guid: string): Promise<IdResponse> {
    try {
      const getCurrentDepartmentRepoRequest = this.departmentMapper.initializeDepartmentByIdRepoRequest(
        id,
        [DepartmentSelectFieldsEnum.GUID, DepartmentSelectFieldsEnum.IS_DELETED]
      );
      const currentDepartment = await this.departmentRepository.getDepartments(getCurrentDepartmentRepoRequest);

      if (!currentDepartment.data.responseList?.length) {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Department with id ${id} not exist`});
        this.logger.error(error);
        throw error;
      } else if (currentDepartment.data.responseList[0].isDeleted) {
        const error = new CustomError({
          code: ErrorCodesEnum.ALREADY_DELETED,
          message: `Department with id ${id} already deleted`
        });

        this.logger.error(error);
        throw error;
      } else if (currentDepartment.data.responseList[0].guid !== guid) {
        const error = new CustomError({code: ErrorCodesEnum.ALREADY_DELETED, message: `Department guid was changed`});
        this.logger.error(error);
        throw error;
      }

      const deleteRepoRequest = this.departmentMapper.deleteDepartmentRequestToRepoRequest(id);
      const {deletedID} = await this.departmentRepository.deleteDepartment(deleteRepoRequest);
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
