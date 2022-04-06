import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class AttestationGetLastDateResponse {
  @Field(type => String, {nullable: true})
  lastAttestationDate: string;

  @Field(type => String, {nullable: true})
  nextAttestationDate: string;
}
