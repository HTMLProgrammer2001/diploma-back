import {FileUpload} from 'graphql-upload';

export abstract class FileServiceInterface {
  /**
   * Save avatar and return his url
   * @param file - uploaded file
   */
  abstract uploadAvatar(file: FileUpload): Promise<string>;
}
