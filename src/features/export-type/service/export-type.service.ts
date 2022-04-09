import {Injectable, Logger} from '@nestjs/common';
import {ExportTypeMapper} from '../mapper/export-type.mapper';
import {ExportTypeGetListRequest} from '../types/request/export-type-get-list.request';
import {IPaginator} from '../../../global/types/interface/IPaginator.interface';
import {ExportTypeResponse} from '../types/response/export-type.response';
import {ExportTypeGetByIdRequest} from '../types/request/export-type-get-by-id.request';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {ExportTypeRepository} from '../../../data-layer/repositories/export-type/export-type.repository';

@Injectable()
export class ExportTypeService {
  private logger: Logger;

  constructor(
    private exportTypeRepository: ExportTypeRepository,
    private exportTypeMapper: ExportTypeMapper,
  ) {
    this.logger = new Logger(ExportTypeService.name);
  }

  async getExportTypeList(request: ExportTypeGetListRequest): Promise<IPaginator<ExportTypeResponse>> {
    try {
      const repoRequest = this.exportTypeMapper.getExportTypeListRequestToRepoRequest(request);
      const {data} = await this.exportTypeRepository.getExportTypes(repoRequest);
      return this.exportTypeMapper.exportTypePaginatorDbModelToResponse(data);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getExportTypeById(request: ExportTypeGetByIdRequest): Promise<ExportTypeResponse> {
    try {
      const repoRequest = this.exportTypeMapper.getExportTypeByIdRequestToRepoRequest(request);
      const {data} = await this.exportTypeRepository.getExportTypes(repoRequest);

      if (data.responseList?.length) {
        return this.exportTypeMapper.exportTypeDbModelToResponse(data.responseList[0]);
      } else {
        const error = new CustomError({code: ErrorCodesEnum.NOT_FOUND, message: `Export type with id ${request.id} not exist`});
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
