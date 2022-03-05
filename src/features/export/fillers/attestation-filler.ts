import {FillerInterface} from './filler.interface';
import {Workbook, Worksheet} from 'exceljs';
import {ExportDataInterface} from '../types/common/export-data.interface';
import {WorksheetEnum} from '../types/common/worksheet.enum';
import {AttestationColumnsEnum} from '../types/common/columns/attestation-columns.enum';
import {dateToString} from '../../../global/utils/functions';

export class AttestationFiller implements FillerInterface {
  static START_ROW = 4;

  constructor() {}

  async fill(workbook: Workbook, data: ExportDataInterface): Promise<void> {
    const worksheet: Worksheet = workbook.getWorksheet(WorksheetEnum.ATTESTATION);

    for(let i = 0; i < data.attestationData.length; i++) {
      const row = AttestationFiller.START_ROW + i;
      const attestationData = data.attestationData[i];

      worksheet.getRow(row).getCell(AttestationColumnsEnum.TEACHER).value = attestationData.teacher?.fullName;
      worksheet.getRow(row).getCell(AttestationColumnsEnum.DATE).value = dateToString(attestationData.date);
      worksheet.getRow(row).getCell(AttestationColumnsEnum.CATEGORY_NAME).value = attestationData.category?.name;
      worksheet.getRow(row).getCell(AttestationColumnsEnum.DESCRIPTION).value = attestationData.description;
    }
  }
}
