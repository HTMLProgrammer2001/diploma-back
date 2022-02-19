import {Module} from '@nestjs/common';
import {RebukeMapper} from './mapper/rebuke.mapper';
import {RebukeService} from './service/rebuke.service';
import {RebukeResolver} from './resolvers/rebuke.resolver';

@Module({
  providers: [RebukeMapper, RebukeService, RebukeResolver],
  exports: [RebukeService]
})
export class RebukeModule {

}
