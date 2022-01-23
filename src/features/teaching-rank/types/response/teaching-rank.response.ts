import {Field, Int, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class TeachingRankResponse {
  @Field(type => Int)
  id: number;

  @Field({nullable: false})
  name: string;

  @Field({nullable: false})
  guid: string;

  @Field({nullable: false})
  isDeleted: boolean;
}
