import {IPaginator} from '../types/interface/IPaginator.interface';
import {NotificationConfig} from '../../features/notification/types/common/notification.config';
import {NotificationTypesEnum} from '../../features/notification/types/common/notification-types.enum';

export function convertFindAndCountToPaginator<T>(data: { rows: Array<T>, count: number }, page: number, size: number):
  IPaginator<T> {
  return {
    page,
    size,
    skip: (page - 1) * size,
    totalElements: data.count,
    totalPages: Math.ceil(data.count / size),
    responseList: data.rows
  }
}

export function parseCronTimeFromNotificationConfig(config: NotificationConfig): string {
  const [hours, minutes] = config.NOTIFY_TIME.split(':');

  switch (config.NOTIFY_TYPE) {
    case NotificationTypesEnum.MONTHLY:
      return `${minutes} ${hours} ${config.NOTIFY_DAY} * *`;

    case NotificationTypesEnum.WEEKLY:
      return `${minutes} ${hours} * * ${config.NOTIFY_DAY}`;

    case NotificationTypesEnum.DAILY:
      return `${minutes} ${hours} * * *`;

    default:
      return '0 0 1 1 *';
  }
}

export function dateToString(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return date && `${year}-${month >= 10 ? month : '0' + month}-${day >= 10 ? day : '0' + day}`;
}
