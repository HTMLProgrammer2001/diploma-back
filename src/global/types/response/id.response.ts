import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class IdResponse {
  @Field(type => ID)
  id: number;
}
