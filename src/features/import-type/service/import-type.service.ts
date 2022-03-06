import {Injectable, Logger} from '@nestjs/common';
import {ImportTypeMapper} from '../mapper/import-type.mapper';
import {ImportTypeGetListRequest} from '../types/request/import-type-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {ImportTypeResponse} from '../types/response/import-type.response';
import {ImportTypeGetByIdRequest} from '../types/request/import-type-get-by-id.request';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {RoleRepository} from '../../../data-layer/repositories/role/role.repository';
import {ImportTypeUpdateRequest} from '../types/request/import-type-update.request';
import {RoleSelectFieldsEnum} from '../../../data-layer/repositories/role/enums/role-select-fields.enum';
import {ImportTypeRepository} from '../../../data-layer/repositories/import-type/import-type.repository';

@Injectable()
export class ImportTypeService {
  private logger: Logger;

  constructor(
    private importTypeRepository: ImportTypeRepository,
    private importTypeMapper: ImportTypeMapper,
  ) {
    this.logger = new Logger(ImportTypeService.name);
  }

  async getImportTypeList(request: ImportTypeGetListRequest): Promise<IPaginator<ImportTypeResponse>> {
    try {
      const repoRequest = this.importTypeMapper.getImportTypeListRequestToRepoRequest(request);
      const {data} = await this.importTypeRepository.getImportTypes(repoRequest);
      return this.importTypeMapper.importTypePaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getImportTypeById(request: ImportTypeGetByIdRequest): Promise<ImportTypeResponse> {
    try {
      const repoRequest = this.importTypeMapper.getImportTypeByIdRequestToRepoRequest(request);
      const {data} = await this.importTypeRepository.getImportTypes(repoRequest);

      if (data.responseList?.length) {
        return this.importTypeMapper.importTypeDbModelToResponse(data.responseList[0]);
      } else {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Import type with id ${request.id} not exist`});
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

  async updateImportType(request: ImportTypeUpdateRequest): Promise<ImportTypeResponse> {
    try {
      const getCurrentRepoRequest = this.importTypeMapper.initializeImportTypeRepoRequest(request.id, [RoleSelectFieldsEnum.GUID]);
      const currentRole = await this.importTypeRepository.getImportTypes(getCurrentRepoRequest);

      if (!currentRole.data.responseList?.length) {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Import type with id ${request.id} not exist`});
        this.logger.error(error);
        throw error;
      } else if (currentRole.data.responseList[0].guid !== request.guid) {
        const error = new CustomError({code: ErrorCodesEnum.GUID_CHANGED, message: 'Import type guid was changed'});
        this.logger.error(error);
        throw error;
      }

      const updateRepoRequest = this.importTypeMapper.updateImportTypeRequestToRepoRequest(request);
      const {updatedID} = await this.importTypeRepository.updateImportType(updateRepoRequest);

      const repoRequest = this.importTypeMapper.initializeImportTypeRepoRequest(updatedID, request.select);
      const {data} = await this.importTypeRepository.getImportTypes(repoRequest);
      return this.importTypeMapper.importTypeDbModelToResponse(data.responseList[0]);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }
}
