import {Module} from '@nestjs/common';
import {HonorMapper} from './mapper/honor.mapper';
import {HonorService} from './service/honor.service';
import {HonorResolver} from './resolvers/honor.resolver';
import {registerEnumType} from '@nestjs/graphql';
import {HonorOrderFieldsEnum} from '../../data-layer/repositories/honor/enums/honor-order-fields.enum';
import {HonorCascadeDeletedByEnum} from '../../data-layer/db-models/honor.db-model';

@Module({
  providers: [HonorMapper, HonorService, HonorResolver],
  exports: [HonorService]
})
export class HonorModule {
  constructor() {
    registerEnumType(HonorOrderFieldsEnum, {name: HonorOrderFieldsEnum.name});
    registerEnumType(HonorCascadeDeletedByEnum, {name: HonorCascadeDeletedByEnum.name});
  }
}
