import {Module} from '@nestjs/common';
import {TeachingRankMapper} from './mapper/teaching-rank.mapper';
import {TeachingRankService} from './service/teaching-rank.service';
import {TeachingRankResolver} from './resolvers/teaching-rank.resolver';
import {registerEnumType} from '@nestjs/graphql';
import {TeachingRankOrderFieldsEnum} from '../../data-layer/repositories/teaching-rank/enums/teaching-rank-order-fields.enum';

@Module({
  providers: [TeachingRankMapper, TeachingRankService, TeachingRankResolver],
  exports: [TeachingRankService]
})
export class TeachingRankModule {
  constructor() {
    registerEnumType(TeachingRankOrderFieldsEnum, {name: TeachingRankOrderFieldsEnum.name});
  }
}
