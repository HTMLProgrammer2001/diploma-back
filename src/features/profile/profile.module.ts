import {Module} from '@nestjs/common';
import {ProfileMapper} from './mapper/profile.mapper';
import {ProfileService} from './service/profile.service';
import {ProfileResolver} from './resolvers/profile.resolver';

@Module({
  providers: [ProfileMapper, ProfileService, ProfileResolver],
  exports: [ProfileService]
})
export class ProfileModule {

}
