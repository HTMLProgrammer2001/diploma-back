import {Controller, Get, Res, All, Param, SetMetadata, HttpStatus} from '@nestjs/common';
import {Response} from 'express';
import {join} from 'path';
import {MetaDataFieldEnum} from './global/constants/meta-data-fields.enum';
import {readRoles} from './global/utils/roles';

@Controller()
export class AppController {
  @Get()
  getAlive(): string {
    return 'It works';
  }

  @SetMetadata(MetaDataFieldEnum.IS_CHECK_AUTHORIZATION, false)
  @Get('/static/avatars/:filename')
  getAvatar(@Param('filename') fileName: string, @Res() response: Response): void {
    response.sendFile(
      join(__dirname, '..', 'static', 'avatars', fileName),
      (err) => err && response.status(HttpStatus.NOT_FOUND).send(`Avatar ${fileName} does not exist`)
    );
  }

  @SetMetadata(MetaDataFieldEnum.IS_CHECK_AUTHORIZATION, true)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @Get('/static/reports/:filename')
  getReport(@Param('filename') fileName: string, @Res() response: Response): void {
    response.sendFile(
      join(__dirname, '..', 'static', 'reports', fileName),
      (err) => err && response.status(HttpStatus.NOT_FOUND).send(`Report ${fileName} does not exist`)
    );
  }

  @SetMetadata(MetaDataFieldEnum.IS_CHECK_AUTHORIZATION, true)
  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @Get('/static/import-templates/:filename')
  getImportTemplate(@Param('filename') fileName: string, @Res() response: Response): void {
    response.sendFile(
      join(__dirname, '..', 'static', 'import-templates', fileName),
      (err) => err && response.status(HttpStatus.NOT_FOUND).send(`Import template ${fileName} does not exist`)
    );
  }
}
