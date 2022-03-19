import {Injectable, Logger} from '@nestjs/common';
import {SchedulerRegistry} from '@nestjs/schedule';
import {ConfigService} from '@nestjs/config';
import {CronJob} from 'cron';
import {parseCronTimeFromNotificationConfig} from '../../../global/utils/functions';
import {NotificationConfigResponse} from '../types/response/notification-config.response';
import {NotificationMapper} from '../mapper/notification.mapper';
import {NotificationUpdateRequest} from '../types/request/notification-update.request';
import {ResultResponse} from '../../../global/types/response/result.response';
import {TeacherRepository} from '../../../data-layer/repositories/teacher/teacher.repository';
import {NotificationTeacherResponse} from '../types/response/notification-teacher.response';
import {CustomError} from '../../../global/class/custom-error';
import {ErrorCodesEnum} from '../../../global/constants/error-codes.enum';
import {MailServiceInterface} from '../../../global/services/mail-service/mail-service.interface';
import {IAccessTokenInfoInterface} from '../../../global/types/interface/IAccessTokenInfo.interface';
import {AccessTokenTypeEnum} from '../../../global/constants/access-token-type.enum';
import {RolesEnum} from '../../../global/constants/roles.enum';
import {JwtService} from '@nestjs/jwt';
import {NotificationRepository} from '../../../data-layer/repositories/notification/notification.repository';

@Injectable()
export class NotificationService {
  private logger: Logger;

  constructor(
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private notificationMapper: NotificationMapper,
    private notificationRepository: NotificationRepository,
    private teacherRepository: TeacherRepository,
    private mailService: MailServiceInterface,
    private jwtService: JwtService,
  ) {
    this.logger = new Logger(NotificationService.name);
    this.restartJob();
  }

  async restartJob() {
    try {
      if (this.schedulerRegistry.getCronJobs().get('notification')) {
        this.logger.debug(`Delete notification job`);
        this.schedulerRegistry.deleteCronJob('notification');
      }
      const schedule = parseCronTimeFromNotificationConfig(await this.notificationRepository.getNotificationConfig());
      this.logger.debug(`Notification cron started with schedule: ${schedule}`);
      const job = new CronJob(schedule, this.notify);
      this.schedulerRegistry.addCronJob('notification', job);
      job.start();
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  notify = async (): Promise<ResultResponse> => {
    try {
      const notificationConfig = await this.notificationRepository.getNotificationConfig();
      const teacherToNotify = await this.getTeachersToNotify();

      if (teacherToNotify.length) {
        if(notificationConfig.IS_NOTIFY_TEACHERS) {
          await Promise.allSettled(teacherToNotify.map(el => {
            const accessTokenPayload: IAccessTokenInfoInterface = {
              type: AccessTokenTypeEnum.TEACHER,
              userId: el.teacher.id,
              email: el.teacher.email,
              role: RolesEnum.VIEWER
            };

            const accessToken = this.jwtService.sign(accessTokenPayload, {
              secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
              expiresIn: Number(this.configService.get('JWT_TEACHER_ACCESS_TOKEN_TTL_SECONDS'))
            });

            return this.mailService.sendTeacherInternshipWarning(el, accessToken);
          }));
        }

        if(notificationConfig.IS_NOTIFY_ADMINS) {
          await Promise.allSettled(notificationConfig.ADMIN_EMAILS.map(adminEmail => {
            return this.mailService.sendAdminInternshipWarning(adminEmail, teacherToNotify);
          }));
        }
      }

      return {result: true};
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  };

  async getNotificationConfig(): Promise<NotificationConfigResponse> {
    try {
      const notificationConfig = await this.notificationRepository.getNotificationConfig();
      return this.notificationMapper.notificationConfigToResponse(notificationConfig);
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async getTeachersToNotify(): Promise<Array<NotificationTeacherResponse>> {
    try {
      const notificationConfig = await this.notificationRepository.getNotificationConfig();
      const teacherToNotifyRepoRequest = this.notificationMapper.initializeTeacherToNotifyRepoRequest(notificationConfig);
      const teachersToNotifyList = await this.teacherRepository.getTeachersToNotify(teacherToNotifyRepoRequest);
      return teachersToNotifyList.map(el => this.notificationMapper.teacherToNotifyRepoResponseToResponse(el));
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }

  async updateNotificationConfig(request: NotificationUpdateRequest): Promise<NotificationConfigResponse> {
    try {
      const currentNotificationConfigJson = await this.notificationRepository.getNotificationConfig();
      const updateNotificationConfigJson = this.notificationMapper.updateNotificationConfigToJson(request, currentNotificationConfigJson);
      this.logger.debug('Update notification config: ', JSON.stringify(updateNotificationConfigJson));
      await this.notificationRepository.updateNotificationConfig(updateNotificationConfigJson);
      this.restartJob();
      return this.getNotificationConfig();
    } catch (e) {
      if (!(e instanceof CustomError)) {
        this.logger.error(e);
        throw new CustomError({code: ErrorCodesEnum.GENERAL, message: e.message});
      }

      throw e;
    }
  }
}
