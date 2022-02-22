import {FileUpload} from 'graphql-upload';
import {Workbook} from 'exceljs';
import {ExportTypeEnum} from '../../../features/export/types/common/export-type.enum';

export abstract class FileServiceInterface {
  /**
   * Save avatar and return his url
   * @param file - uploaded file
   */
  abstract uploadAvatar(file: FileUpload): Promise<string>;

  /**
   * Save report and return his url
   */
  abstract saveReport(workbook: Workbook, type: ExportTypeEnum): Promise<string>;
}
