import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {registerEnumType} from '@nestjs/graphql';
import {NotificationMapper} from './mapper/notification.mapper';
import {NotificationResolver} from './resolvers/notification.resolver';
import {NotificationService} from './service/notification.service';
import {NotificationTypesEnum} from './types/common/notification-types.enum';

@Module({
  imports: [ConfigModule],
  providers: [NotificationMapper, NotificationResolver, NotificationService]
})
export class NotificationModule {
  constructor() {
    registerEnumType(NotificationTypesEnum, {name: 'NotificationTypes'});
  }
}
