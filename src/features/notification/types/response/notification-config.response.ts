import {Field, ObjectType, registerEnumType} from '@nestjs/graphql';
import {NotificationTypesEnum} from '../common/notification-types.enum';

registerEnumType(NotificationTypesEnum, {name: 'notificationTypes'});

@ObjectType()
export class NotificationConfigResponse {
  @Field()
  isNotifyTeachers: boolean;

  @Field()
  isNotifyAdmins: boolean;

  @Field(type => [String])
  adminEmails: Array<string>;

  @Field(type => NotificationTypesEnum)
  notifyType: NotificationTypesEnum;

  @Field()
  notifyDay: number;

  @Field()
  notifyTime: string;

  @Field()
  notifyBeforeDays: number;

  @Field()
  attestationYearsPeriod: number;

  @Field()
  requiredInternshipHours: number;

  @Field()
  schedule: string;
}
