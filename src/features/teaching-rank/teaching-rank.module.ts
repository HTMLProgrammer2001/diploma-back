import {Module} from '@nestjs/common';
import {TeachingRankMapper} from './mapper/teaching-rank.mapper';
import {TeachingRankService} from './service/teaching-rank.service';
import {TeachingRankResolver} from './resolvers/teaching-rank.resolver';

@Module({
  providers: [TeachingRankMapper, TeachingRankService, TeachingRankResolver]
})
export class TeachingRankModule {

}
