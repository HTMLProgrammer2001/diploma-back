import {NotificationTypesEnum} from './notification-types.enum';

export class NotificationConfig {
  IS_NOTIFY_TEACHERS: boolean;
  IS_NOTIFY_ADMINS: boolean;
  ADMIN_EMAILS: Array<string>;
  NOTIFY_TYPE: NotificationTypesEnum;
  NOTIFY_DAY: number;
  NOTIFY_TIME: string;
  NOTIFY_BEFORE_DAYS: number;
  ATTESTATION_YEARS_PERIOD: number;
  REQUIRED_INTERNSHIP_HOURS: number;
}
