import {Module} from '@nestjs/common';
import {RebukeMapper} from './mapper/rebuke.mapper';
import {RebukeService} from './service/rebuke.service';
import {RebukeResolver} from './resolvers/rebuke.resolver';
import {registerEnumType} from '@nestjs/graphql';
import {RebukeOrderFieldsEnum} from '../../data-layer/repositories/rebuke/enums/rebuke-order-fields.enum';
import {RebukeCascadeDeletedByEnum} from '../../data-layer/db-models/rebuke.db-model';

@Module({
  providers: [RebukeMapper, RebukeService, RebukeResolver],
  exports: [RebukeService]
})
export class RebukeModule {
  constructor() {
    registerEnumType(RebukeOrderFieldsEnum, {name: RebukeOrderFieldsEnum.name});
    registerEnumType(RebukeCascadeDeletedByEnum, {name: RebukeCascadeDeletedByEnum.name});
  }
}
