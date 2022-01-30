import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class DepartmentResponse {
  @Field(type => ID)
  id: number;

  @Field({nullable: false})
  name: string;

  @Field({nullable: false})
  guid: string;

  @Field({nullable: false})
  isDeleted: boolean;
}
