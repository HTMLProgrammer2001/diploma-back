import {Module} from '@nestjs/common';
import {AttestationMapper} from './mapper/attestation.mapper';
import {AttestationService} from './service/attestation.service';
import {AttestationResolver} from './resolvers/attestation.resolver';
import {registerEnumType} from '@nestjs/graphql';
import {AttestationOrderFieldsEnum} from '../../data-layer/repositories/attestation/enums/attestation-order-fields.enum';
import {AttestationCascadeDeleteByEnum} from '../../data-layer/db-models/attestation.db-model';

@Module({
  providers: [AttestationMapper, AttestationService, AttestationResolver],
  exports: [AttestationService]
})
export class AttestationModule {
  constructor() {
    registerEnumType(AttestationOrderFieldsEnum, {name: AttestationOrderFieldsEnum.name});
    registerEnumType(AttestationCascadeDeleteByEnum, {name: AttestationCascadeDeleteByEnum.name});
  }
}
