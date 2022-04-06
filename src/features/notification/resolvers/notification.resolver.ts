import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {NotificationService} from '../service/notification.service';
import {ResultResponse} from '../../../global/types/response/result.response';
import {SetMetadata} from '@nestjs/common';
import {MetaDataFieldEnum} from '../../../global/constants/meta-data-fields.enum';
import {notificationConfigurationRoles, readRoles} from '../../../global/utils/roles';
import {NotificationUpdateRequest} from '../types/request/notification-update.request';
import {NotificationConfigResponse} from '../types/response/notification-config.response';
import {NotificationTeacherResponse} from '../types/response/notification-teacher.response';

@Resolver()
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @SetMetadata(MetaDataFieldEnum.ROLES, notificationConfigurationRoles)
  @Query(returns => NotificationConfigResponse)
  async getNotificationConfig(): Promise<NotificationConfigResponse> {
    return this.notificationService.getNotificationConfig();
  }

  @SetMetadata(MetaDataFieldEnum.ROLES, readRoles)
  @Query(returns => [NotificationTeacherResponse])
  async getTeachersToNotify(): Promise<Array<NotificationTeacherResponse>> {
    return this.notificationService.getTeachersToNotify();
  }

  @SetMetadata(MetaDataFieldEnum.ROLES, notificationConfigurationRoles)
  @Mutation(returns => NotificationConfigResponse)
  async updateNotificationConfig(@Args('body') body: NotificationUpdateRequest): Promise<NotificationConfigResponse> {
    return this.notificationService.updateNotificationConfig(body);
  }

  @SetMetadata(MetaDataFieldEnum.ROLES, notificationConfigurationRoles)
  @Mutation(returns => ResultResponse)
  async triggerNotification(): Promise<ResultResponse> {
    return this.notificationService.notify();
  }
}
