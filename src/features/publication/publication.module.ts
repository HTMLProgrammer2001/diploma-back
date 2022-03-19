import {Module} from '@nestjs/common';
import {PublicationMapper} from './mapper/publication.mapper';
import {PublicationService} from './service/publication.service';
import {PublicationResolver} from './resolvers/publication.resolver';
import {registerEnumType} from '@nestjs/graphql';
import {PublicationOrderFieldsEnum} from '../../data-layer/repositories/publication/enums/publication-order-fields.enum';

@Module({
  providers: [PublicationMapper, PublicationService, PublicationResolver],
  exports: [PublicationService]
})
export class PublicationModule {
  constructor() {
    registerEnumType(PublicationOrderFieldsEnum, {name: PublicationOrderFieldsEnum.name});
  }
}
