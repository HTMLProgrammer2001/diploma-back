import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {NotificationMapper} from './mapper/notification.mapper';
import {NotificationResolver} from './resolvers/notification.resolver';
import {NotificationService} from './service/notification.service';

@Module({
  imports: [ConfigModule],
  providers: [NotificationMapper, NotificationResolver, NotificationService]
})
export class NotificationModule {

}
