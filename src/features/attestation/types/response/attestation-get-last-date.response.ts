import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class AttestationGetLastDateResponse {
  @Field(type => String)
  lastAttestationDate: string;

  @Field(type => String)
  nextAttestationDate: string;
}
