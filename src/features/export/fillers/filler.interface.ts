import {Workbook} from 'exceljs';
import {TeacherDbModel} from '../../../data-layer/db-models/teacher.db-model';
import {ExportDataInterface} from '../types/common/export-data.interface';

export interface FillerInterface {
  fill(workbook: Workbook, teacherList: Array<TeacherDbModel>, data: ExportDataInterface): Promise<void>;
}
