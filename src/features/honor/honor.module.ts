import {Module} from '@nestjs/common';
import {HonorMapper} from './mapper/honor.mapper';
import {HonorService} from './service/honor.service';
import {HonorResolver} from './resolvers/honor.resolver';

@Module({
  providers: [HonorMapper, HonorService, HonorResolver],
  exports: [HonorService]
})
export class HonorModule {

}
