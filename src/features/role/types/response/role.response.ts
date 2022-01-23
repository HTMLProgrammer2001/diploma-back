import {Field, Int, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class RoleResponse {
  @Field(type => Int)
  id: number;

  @Field({nullable: false})
  name: string;
}
