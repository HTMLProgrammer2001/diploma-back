import {Injectable} from '@nestjs/common';
import {FileServiceInterface} from './file-service.interface';
import {FileUpload} from 'graphql-upload';
import {randomUUID} from 'crypto';
import {createWriteStream} from 'fs';

@Injectable()
export class LocalFileService extends FileServiceInterface {
  async uploadAvatar(file: FileUpload): Promise<string> {
    const {createReadStream, filename} = file;
    const newFileName = `${randomUUID()}.${filename.split('.').pop()}`;
    await createReadStream().pipe(createWriteStream(`./static/avatars/${newFileName}`));
    return `${process.env.APP_URL}/static/avatars/${newFileName}`;
  }
}
