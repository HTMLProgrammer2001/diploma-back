import {FillerInterface} from './filler.interface';
import {Workbook, Worksheet} from 'exceljs';
import {ExportDataInterface} from '../types/common/export-data.interface';
import {WorksheetEnum} from '../types/common/worksheet.enum';
import {HonorColumnsEnum} from '../types/common/columns/honor-columns.enum';
import {dateToString} from '../../../global/utils/functions';

export class HonorFiller implements FillerInterface {
  static START_ROW = 4;

  constructor() {}

  async fill(workbook: Workbook, data: ExportDataInterface): Promise<void> {
    const worksheet: Worksheet = workbook.getWorksheet(WorksheetEnum.HONOR);

    for(let i = 0; i < data.honorData.length; i++) {
      const row = HonorFiller.START_ROW + i;
      const honorData = data.honorData[i];

      worksheet.getRow(row).getCell(HonorColumnsEnum.TEACHER).value = honorData.teacher?.fullName;
      worksheet.getRow(row).getCell(HonorColumnsEnum.TITLE).value = honorData.title;
      worksheet.getRow(row).getCell(HonorColumnsEnum.DATE).value = dateToString(honorData.date);
      worksheet.getRow(row).getCell(HonorColumnsEnum.ORDER_NUMBER).value = honorData.orderNumber;
      worksheet.getRow(row).getCell(HonorColumnsEnum.DESCRIPTION).value = honorData.description;
    }
  }
}
