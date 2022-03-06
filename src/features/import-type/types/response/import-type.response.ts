import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class ImportTypeResponse {
  @Field(type => ID)
  id: number;

  @Field({nullable: false})
  name: string;

  @Field({nullable: false})
  guid: string;
}
