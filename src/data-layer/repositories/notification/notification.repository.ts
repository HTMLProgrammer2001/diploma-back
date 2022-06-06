import {Injectable} from '@nestjs/common';
import {readFile, writeFile} from 'fs/promises';
import {NotificationConfig} from '../../../features/notification/types/common/notification.config';

@Injectable()
export class NotificationRepository {
  async getNotificationConfig(): Promise<NotificationConfig> {
    return JSON.parse(await readFile('./notification.config.json', {encoding: 'utf-8'}));
  }

  async updateNotificationConfig(body: NotificationConfig): Promise<NotificationConfig> {
    await writeFile('./notification.config.json', JSON.stringify(body, null, 4));
    return body;
  }
}