import {Module} from '@nestjs/common';
import {ProfileMapper} from './mapper/profile.mapper';
import {ProfileService} from './service/profile.service';
import {ProfileResolver} from './resolvers/profile.resolver';
import {ConfigModule} from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ProfileMapper, ProfileService, ProfileResolver],
  exports: [ProfileService]
})
export class ProfileModule {

}
