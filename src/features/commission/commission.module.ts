import {Module} from '@nestjs/common';
import {CommissionMapper} from './mapper/commission.mapper';
import {CommissionService} from './service/commission.service';
import {CommissionResolver} from './resolvers/commission.resolver';

@Module({
  providers: [CommissionMapper, CommissionService, CommissionResolver],
  exports: [CommissionService]
})
export class CommissionModule {

}
