import {Injectable, Logger} from '@nestjs/common';
import {GenerateImportTemplateRequest} from '../types/request/generate-import-template.request';
import {GenerateImportTemplateResponse} from '../types/response/generate-import-template.response';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {ImportDataTypeEnum} from '../types/common/import-data-type.enum';
import {Workbook} from 'exceljs';
import {ImportMapper} from '../mapper/import.mapper';
import {RoleRepository} from '../../../data-layer/repositories/role/role.repository';
import {FileServiceInterface} from '../../../global/services/file-service/file-service.interface';

@Injectable()
export class GenerateImportTemplateService {
  static DATA_LIST_PAGE = 2;

  private logger: Logger;

  constructor(
    private fileService: FileServiceInterface,
    private importMapper: ImportMapper,
    private roleRepository: RoleRepository,
  ) {
    this.logger = new Logger(GenerateImportTemplateService.name);
  }

  async generateImportTemplate(request: GenerateImportTemplateRequest): Promise<GenerateImportTemplateResponse> {
    try {
      let workbook: Workbook;

      switch (request.type) {
        case ImportDataTypeEnum.USER:
          workbook = await this.generateImportUserTemplate();
          break;
        default:
          throw new CustomError({code: ErrorCodesEnum.VALIDATION, message: 'Invalid type'});
      }

      const url = await this.fileService.saveImportTemplate(workbook, request.type);
      return {url};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async generateImportUserTemplate(): Promise<Workbook> {
    try {
    const workbook = new Workbook();
    const template = await workbook.xlsx.readFile('./templates/import-user-template.xlsx');
    const worksheet = await template.getWorksheet(GenerateImportTemplateService.DATA_LIST_PAGE);

    const getAllRolesRepoRequest = this.importMapper.initializeGetAllRolesRepoRequest();
    const rolesRepoResponse = await this.roleRepository.getRoles(getAllRolesRepoRequest);

    for(let i = 0; i < rolesRepoResponse.data.responseList.length; i++) {
      const role = rolesRepoResponse.data.responseList[i];
      worksheet.getRow(i + 1).getCell(1).value = `${role.id} - ${role.name}`;
    }

    return template;
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }
}
