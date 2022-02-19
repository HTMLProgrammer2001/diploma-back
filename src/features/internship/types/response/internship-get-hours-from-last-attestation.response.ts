import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class InternshipGetHoursFromLastAttestationResponse {
  @Field()
  hours: number;
}
