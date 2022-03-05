import {Injectable, Logger} from '@nestjs/common';
import {MailServiceInterface} from './mail-service.interface';
import {NotificationTeacherResponse} from '../../../features/notification/types/response/notification-teacher.response';

@Injectable()
export class LocalMailService extends MailServiceInterface {
  private logger: Logger;

  constructor() {
    super();
    this.logger = new Logger('LocalMail');
  }

  async sendTeacherLoginMail(email: string, token: string): Promise<void> {
    this.logger.log(`Login teacher: ${email} -- ${token}`);
  }

  async sendTeacherInternshipWarning(notificationTeacher: NotificationTeacherResponse, token: string): Promise<void> {
    this.logger.log(`Teacher internship warning: ${token} -- ${JSON.stringify(notificationTeacher)}`);
  }

  async sendAdminInternshipWarning(email: string, notificationTeachers: Array<NotificationTeacherResponse>): Promise<void> {
    this.logger.log(`Admin internship warning: ${email} -- ${JSON.stringify(notificationTeachers)}`);
  }
}
