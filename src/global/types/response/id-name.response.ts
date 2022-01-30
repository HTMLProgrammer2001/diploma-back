import {Field, Int, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class IdNameResponse {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;
}
