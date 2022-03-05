import {FileUpload} from 'graphql-upload';
import {Workbook} from 'exceljs';
import {ImportDataTypeEnum} from '../../../features/import/types/common/import-data-type.enum';

export abstract class FileServiceInterface {
  /**
   * Save avatar and return his url
   * @param file - uploaded file
   */
  abstract uploadAvatar(file: FileUpload): Promise<string>;

  /**
   * Save report and return his url
   */
  abstract saveReport(workbook: Workbook): Promise<string>;

  /**
   * Save import template and return his url
   */
  abstract saveImportTemplate(workbook: Workbook, type: ImportDataTypeEnum): Promise<string>;
}
