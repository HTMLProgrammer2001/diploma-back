import {FillerInterface} from './filler.interface';
import {Workbook, Worksheet} from 'exceljs';
import {ExportDataInterface} from '../types/common/export-data.interface';
import {WorksheetEnum} from '../types/common/worksheet.enum';
import {InternshipColumnsEnum} from '../types/common/columns/internship-columns.enum';
import {RebukeColumnsEnum} from '../types/common/columns/rebuke-columns.enum';
import {dateToString} from '../../../global/utils/functions';

export class RebukeFiller implements FillerInterface {
  static START_ROW = 4;

  constructor() {}

  async fill(workbook: Workbook, data: ExportDataInterface): Promise<void> {
    const worksheet: Worksheet = workbook.getWorksheet(WorksheetEnum.REBUKE);

    for(let i = 0; i < data.rebukeData.length; i++) {
      const row = RebukeFiller.START_ROW + i;
      const rebukeData = data.rebukeData[i];

      worksheet.getRow(row).getCell(RebukeColumnsEnum.TEACHER).value = rebukeData.teacher?.fullName;
      worksheet.getRow(row).getCell(RebukeColumnsEnum.TITLE).value = rebukeData.title;
      worksheet.getRow(row).getCell(RebukeColumnsEnum.DATE).value = dateToString(rebukeData.date);
      worksheet.getRow(row).getCell(RebukeColumnsEnum.ORDER_NUMBER).value = rebukeData.orderNumber;
      worksheet.getRow(row).getCell(RebukeColumnsEnum.DESCRIPTION).value = rebukeData.description;
    }
  }
}
