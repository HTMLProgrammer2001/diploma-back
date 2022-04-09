import {Injectable, Logger} from '@nestjs/common';
import {ImportTypeMapper} from '../mapper/import-type.mapper';
import {ImportTypeGetListRequest} from '../types/request/import-type-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {ImportTypeResponse} from '../types/response/import-type.response';
import {ImportTypeGetByIdRequest} from '../types/request/import-type-get-by-id.request';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
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
}
