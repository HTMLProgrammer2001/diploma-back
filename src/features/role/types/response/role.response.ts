import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class RoleResponse {
  @Field(type => ID)
  id: number;

  @Field({nullable: false})
  name: string;

  @Field({nullable: false})
  guid: string;
}
