import {Module} from '@nestjs/common';
import {PublicationMapper} from './mapper/publication.mapper';
import {PublicationService} from './service/publication.service';
import {PublicationResolver} from './resolvers/publication.resolver';

@Module({
  providers: [PublicationMapper, PublicationService, PublicationResolver],
  exports: [PublicationService]
})
export class PublicationModule {

}
