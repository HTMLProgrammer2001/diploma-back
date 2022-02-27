import {FillerInterface} from './filler.interface';
import {Workbook, Worksheet} from 'exceljs';
import {ExportDataInterface} from '../types/common/export-data.interface';
import {WorksheetEnum} from '../types/common/worksheet.enum';
import {TeacherPersonalAndProfessionalColumnsEnum} from '../types/common/columns/teacher-personal-and-professional-columns.enum';
import {TeacherPersonalColumnsEnum} from '../types/common/columns/teacher-personal-columns.enum';
import {TeacherProfessionalColumnsEnum} from '../types/common/columns/teacher-professional-columns.enum';

export class TeacherFiller implements FillerInterface {
  static START_ROW = 4;

  constructor(private isIncludePersonal: boolean, private isIncludeProfessional: boolean) {}

  async fill(workbook: Workbook, data: ExportDataInterface): Promise<void> {
    let worksheet: Worksheet;

    if(this.isIncludeProfessional && this.isIncludePersonal) {
      worksheet = workbook.getWorksheet(WorksheetEnum.TEACHER_PERSONAL_AND_PROFESSIONAL);
    }
    else if(this.isIncludePersonal) {
      worksheet = workbook.getWorksheet(WorksheetEnum.TEACHER_PERSONAL);
    }
    else {
      worksheet = workbook.getWorksheet(WorksheetEnum.TEACHER_PROFESSIONAL);
    }

    for(let i = 0; i < data.teacherData.length; i++) {
      const row = TeacherFiller.START_ROW + i;
      const teacherData = data.teacherData[i];

      if(this.isIncludePersonal && this.isIncludeProfessional) {
        worksheet.getRow(row).getCell(TeacherPersonalAndProfessionalColumnsEnum.TEACHER).value = teacherData.fullName;
        worksheet.getRow(row).getCell(TeacherPersonalAndProfessionalColumnsEnum.EMAIL).value = teacherData.email;
        worksheet.getRow(row).getCell(TeacherPersonalAndProfessionalColumnsEnum.PHONE).value = teacherData.phone;
        worksheet.getRow(row).getCell(TeacherPersonalAndProfessionalColumnsEnum.ADDRESS).value = teacherData.address;
        worksheet.getRow(row).getCell(TeacherPersonalAndProfessionalColumnsEnum.BIRTHDAY).value = teacherData.birthday;
        worksheet.getRow(row).getCell(TeacherPersonalAndProfessionalColumnsEnum.RANK).value = teacherData.teacherRank?.name;
        worksheet.getRow(row).getCell(TeacherPersonalAndProfessionalColumnsEnum.ACADEMIC_TITLE).value = teacherData.academicTitle?.name;
        worksheet.getRow(row).getCell(TeacherPersonalAndProfessionalColumnsEnum.ACADEMIC_DEGREE).value = teacherData.academicDegree?.name;
        worksheet.getRow(row).getCell(TeacherPersonalAndProfessionalColumnsEnum.DEPARTMENT).value = teacherData.department?.name;
        worksheet.getRow(row).getCell(TeacherPersonalAndProfessionalColumnsEnum.COMMISSION).value = teacherData.commission?.name;
        worksheet.getRow(row).getCell(TeacherPersonalAndProfessionalColumnsEnum.WORK_START_DATE).value = teacherData.workStartDate;
      }
      else if(this.isIncludePersonal) {
        worksheet.getRow(row).getCell(TeacherPersonalColumnsEnum.TEACHER).value = teacherData.fullName;
        worksheet.getRow(row).getCell(TeacherPersonalColumnsEnum.EMAIL).value = teacherData.email;
        worksheet.getRow(row).getCell(TeacherPersonalColumnsEnum.PHONE).value = teacherData.phone;
        worksheet.getRow(row).getCell(TeacherPersonalColumnsEnum.ADDRESS).value = teacherData.address;
        worksheet.getRow(row).getCell(TeacherPersonalColumnsEnum.BIRTHDAY).value = teacherData.birthday;
      }
      else {
        worksheet.getRow(row).getCell(TeacherProfessionalColumnsEnum.TEACHER).value = teacherData.fullName;
        worksheet.getRow(row).getCell(TeacherProfessionalColumnsEnum.RANK).value = teacherData.teacherRank?.name;
        worksheet.getRow(row).getCell(TeacherProfessionalColumnsEnum.ACADEMIC_TITLE).value = teacherData.academicTitle?.name;
        worksheet.getRow(row).getCell(TeacherProfessionalColumnsEnum.ACADEMIC_DEGREE).value = teacherData.academicDegree?.name;
        worksheet.getRow(row).getCell(TeacherProfessionalColumnsEnum.DEPARTMENT).value = teacherData.department?.name;
        worksheet.getRow(row).getCell(TeacherProfessionalColumnsEnum.COMMISSION).value = teacherData.commission?.name;
        worksheet.getRow(row).getCell(TeacherProfessionalColumnsEnum.WORK_START_DATE).value = teacherData.workStartDate;
      }
    }
  }
}
