import {FillerInterface} from './filler.interface';
import {Workbook, Worksheet} from 'exceljs';
import {ExportDataInterface} from '../types/common/export-data.interface';
import {WorksheetEnum} from '../types/common/worksheet.enum';
import {InternshipColumnsEnum} from '../types/common/columns/internship-columns.enum';

export class InternshipFiller implements FillerInterface {
  static START_ROW = 4;

  constructor() {}

  async fill(workbook: Workbook, data: ExportDataInterface): Promise<void> {
    const worksheet: Worksheet = workbook.getWorksheet(WorksheetEnum.INTERNSHIP);

    for(let i = 0; i < data.internshipData.length; i++) {
      const row = InternshipFiller.START_ROW + i;
      const internshipData = data.internshipData[i];

      worksheet.getRow(row).getCell(InternshipColumnsEnum.TEACHER).value = internshipData.teacher?.fullName;
      worksheet.getRow(row).getCell(InternshipColumnsEnum.TITLE).value = internshipData.title;
      worksheet.getRow(row).getCell(InternshipColumnsEnum.FROM).value = internshipData.from?.toLocaleDateString();
      worksheet.getRow(row).getCell(InternshipColumnsEnum.TO).value = internshipData.to?.toLocaleDateString();
      worksheet.getRow(row).getCell(InternshipColumnsEnum.HOURS).value = internshipData.hours;
      worksheet.getRow(row).getCell(InternshipColumnsEnum.PLACE).value = internshipData.place;
      worksheet.getRow(row).getCell(InternshipColumnsEnum.CREDITS).value = internshipData.credits;
      worksheet.getRow(row).getCell(InternshipColumnsEnum.DESCRIPTION).value = internshipData.description;
    }
  }
}
