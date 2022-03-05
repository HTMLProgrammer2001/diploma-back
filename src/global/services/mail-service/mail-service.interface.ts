import {NotificationTeacherResponse} from '../../../features/notification/types/response/notification-teacher.response';

export abstract class MailServiceInterface {
  /**
   * Send mail to teacher with url to login
   * @param email - teacher email
   * @param token - teacher access token
   */
  abstract sendTeacherLoginMail(email: string, token: string): Promise<void>;

  /**
   * Send mail about not enough internship hours to teacher
   * @param notificationTeacher - info to send
   * @param token - teacher access token
   */
  abstract sendTeacherInternshipWarning(notificationTeacher: NotificationTeacherResponse, token: string): Promise<void>;

  /**
   * Send mail about not enough internship hours to admin
   * @param email - admin email
   * @param notificationTeachers - info to send
   */
  abstract sendAdminInternshipWarning(email: string, notificationTeachers: Array<NotificationTeacherResponse>): Promise<void>;
}
