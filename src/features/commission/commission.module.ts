import {Module} from '@nestjs/common';
import {CommissionMapper} from './mapper/commission.mapper';
import {CommissionService} from './service/commission.service';
import {CommissionResolver} from './resolvers/commission.resolver';
import {registerEnumType} from '@nestjs/graphql';
import {CommissionOrderFieldsEnum} from '../../data-layer/repositories/commission/enums/commission-order-fields.enum';

@Module({
  providers: [CommissionMapper, CommissionService, CommissionResolver],
  exports: [CommissionService]
})
export class CommissionModule {
  constructor() {
    registerEnumType(CommissionOrderFieldsEnum, {name: CommissionOrderFieldsEnum.name});
  }
}
