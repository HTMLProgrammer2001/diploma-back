import {Injectable} from '@nestjs/common';
import {FileServiceInterface} from './file-service.interface';
import {FileUpload} from 'graphql-upload';
import {randomUUID} from 'crypto';
import {createWriteStream} from 'fs';
import {Workbook} from 'exceljs';
import {ConfigService} from '@nestjs/config';
import {dateToString} from '../../utils/functions';
import {ImportDataTypeEnum} from '../../../features/import/types/common/import-data-type.enum';

@Injectable()
export class LocalFileService extends FileServiceInterface {
  constructor(private configService: ConfigService) {
    super();
  }

  async uploadAvatar(file: FileUpload): Promise<string> {
    const {createReadStream, filename} = file;
    const newFileName = `${randomUUID()}.${filename.split('.').pop()}`;
    await createReadStream().pipe(createWriteStream(`./static/avatars/${newFileName}`));
    return `${this.configService.get('APP_URL')}/static/avatars/${newFileName}`;
  }

  async saveReport(workbook: Workbook): Promise<string> {
    const date = new Date();
    const hash = `${dateToString(date)}_${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}`;
    const fileName = `Report-teacher-${hash}.xlsx`;

    await workbook.xlsx.writeFile(`./static/reports/${fileName}`);
    return `${this.configService.get('APP_URL')}/static/reports/${fileName}`;
  }

  async saveImportTemplate(workbook: Workbook, type: ImportDataTypeEnum): Promise<string> {
    const date = new Date();
    const hash = `${dateToString(date)}_${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}`;
    const fileName = `Import-${type.toLowerCase()}-${hash}.xlsx`;

    await workbook.xlsx.writeFile(`./static/import-templates/${fileName}`);
    return `${this.configService.get('APP_URL')}/static/import-templates/${fileName}`;
  }
}
