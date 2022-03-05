import {Injectable} from '@nestjs/common';
import {NotificationConfig} from '../types/common/notification.config';
import {NotificationConfigResponse} from '../types/response/notification-config.response';
import {dateToString, parseCronTimeFromNotificationConfig} from '../../../global/utils/functions';
import {NotificationUpdateRequest} from '../types/request/notification-update.request';
import {TeacherToNotifyRepoRequest} from '../../../data-layer/repositories/teacher/repo-request/teacher-to-notify.repo-request';
import {TeacherToNotifyRepoResponse} from '../../../data-layer/repositories/teacher/repo-response/teacher-to-notify.repo-response';
import {NotificationTeacherResponse} from '../types/response/notification-teacher.response';

@Injectable()
export class NotificationMapper {
  notificationConfigToResponse(source: NotificationConfig): NotificationConfigResponse {
    const destination = new NotificationConfigResponse();

    destination.isNotifyAdmins = source.IS_NOTIFY_ADMINS;
    destination.isNotifyTeachers = source.IS_NOTIFY_TEACHERS;
    destination.notifyType = source.NOTIFY_TYPE;
    destination.notifyDay = Number(source.NOTIFY_DAY);
    destination.notifyTime = source.NOTIFY_TIME;
    destination.adminEmails = source.ADMIN_EMAILS;
    destination.notifyBeforeDays = source.NOTIFY_BEFORE_DAYS;
    destination.schedule = parseCronTimeFromNotificationConfig(source);
    destination.attestationYearsPeriod = source.ATTESTATION_YEARS_PERIOD;
    destination.requiredInternshipHours = source.REQUIRED_INTERNSHIP_HOURS;

    return destination;
  }

  updateNotificationConfigToJson(source: NotificationUpdateRequest, currentConfig: NotificationConfig) : NotificationConfig {
    const destination = new NotificationConfig();

    destination.NOTIFY_TYPE = source.notifyType ?? currentConfig.NOTIFY_TYPE;
    destination.NOTIFY_DAY = source.notifyDay ?? currentConfig.NOTIFY_DAY;
    destination.NOTIFY_TIME = source.notifyTime ?? currentConfig.NOTIFY_TIME;
    destination.IS_NOTIFY_ADMINS = source.isNotifyAdmins ?? currentConfig.IS_NOTIFY_ADMINS;
    destination.IS_NOTIFY_TEACHERS = source.isNotifyTeachers ?? currentConfig.IS_NOTIFY_TEACHERS;
    destination.ADMIN_EMAILS = source.adminEmails ?? currentConfig.ADMIN_EMAILS;
    destination.NOTIFY_BEFORE_DAYS = source.notifyBeforeDays ?? currentConfig.NOTIFY_BEFORE_DAYS;
    destination.ATTESTATION_YEARS_PERIOD = source.attestationYearsPeriod ?? currentConfig.ATTESTATION_YEARS_PERIOD;
    destination.REQUIRED_INTERNSHIP_HOURS = source.requiredInternshipHours ?? currentConfig.REQUIRED_INTERNSHIP_HOURS;

    return destination;
  }

  initializeTeacherToNotifyRepoRequest(notificationConfig: NotificationConfig): TeacherToNotifyRepoRequest {
    const destination = new TeacherToNotifyRepoRequest();

    destination.notifyBeforeDays = notificationConfig.NOTIFY_BEFORE_DAYS;
    destination.attestationYearsPeriod = notificationConfig.ATTESTATION_YEARS_PERIOD;
    destination.requiredInternshipHours = notificationConfig.REQUIRED_INTERNSHIP_HOURS;

    return destination;
  }

  teacherToNotifyRepoResponseToResponse(source: TeacherToNotifyRepoResponse): NotificationTeacherResponse {
    const destination = new NotificationTeacherResponse();

    destination.teacher = {
      id: source.teacherId,
      name: source.teacherName,
      email: source.teacherEmail
    };
    destination.lastAttestationDate = dateToString(new Date(source.lastAttestationDate));
    destination.nextAttestationDate = dateToString(new Date(source.nextAttestationDate));
    destination.internshipHours = source.internshipHours;

    return destination;
  }
}
