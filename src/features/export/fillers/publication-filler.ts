import {FillerInterface} from './filler.interface';
import {Workbook, Worksheet} from 'exceljs';
import {ExportDataInterface} from '../types/common/export-data.interface';
import {WorksheetEnum} from '../types/common/worksheet.enum';
import {InternshipColumnsEnum} from '../types/common/columns/internship-columns.enum';
import {RebukeColumnsEnum} from '../types/common/columns/rebuke-columns.enum';
import {PublicationColumnsEnum} from '../types/common/columns/publication-columns.enum';
import {dateToString} from '../../../global/utils/functions';

export class PublicationFiller implements FillerInterface {
  static START_ROW = 4;

  constructor() {}

  async fill(workbook: Workbook, data: ExportDataInterface): Promise<void> {
    const worksheet: Worksheet = workbook.getWorksheet(WorksheetEnum.PUBLICATION);

    for(let i = 0; i < data.publicationData.length; i++) {
      const row = PublicationFiller.START_ROW + i;
      const publicationData = data.publicationData[i];

      let authors = publicationData.teachers.map(teacher => teacher.fullName).join(', ');
      authors += publicationData.anotherAuthors ? ` & ${publicationData.anotherAuthors}` : '';
      worksheet.getRow(row).getCell(PublicationColumnsEnum.TITLE).value = publicationData.title;
      worksheet.getRow(row).getCell(PublicationColumnsEnum.DATE).value = dateToString(publicationData.date);
      worksheet.getRow(row).getCell(PublicationColumnsEnum.PUBLISHER).value = publicationData.publisher;
      worksheet.getRow(row).getCell(PublicationColumnsEnum.AUTHORS).value = authors;
      worksheet.getRow(row).getCell(PublicationColumnsEnum.URL).value = publicationData.url;
      worksheet.getRow(row).getCell(PublicationColumnsEnum.DESCRIPTION).value = publicationData.description;
    }
  }
}
