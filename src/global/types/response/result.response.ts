import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class ResultResponse {
  @Field()
  result: boolean;
}
