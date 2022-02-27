import {Workbook} from 'exceljs';
import {ExportDataInterface} from '../types/common/export-data.interface';

export interface FillerInterface {
  fill(workbook: Workbook, data: ExportDataInterface): Promise<void>;
}
