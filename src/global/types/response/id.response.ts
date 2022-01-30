import {Field, Int, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class IdResponse {
  @Field(type => Int)
  id: number;
}
