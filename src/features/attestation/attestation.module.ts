import {Module} from '@nestjs/common';
import {AttestationMapper} from './mapper/attestation.mapper';
import {AttestationService} from './service/attestation.service';
import {AttestationResolver} from './resolvers/attestation.resolver';

@Module({
  providers: [AttestationMapper, AttestationService, AttestationResolver]
})
export class AttestationModule {

}
