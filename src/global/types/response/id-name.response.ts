import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class IdNameResponse {
  @Field(type => ID)
  id: number;

  @Field()
  name: string;
}
