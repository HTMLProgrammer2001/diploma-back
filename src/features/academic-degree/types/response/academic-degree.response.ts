import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class AcademicDegreeResponse {
  @Field(type => ID)
  id: number;

  @Field({nullable: false})
  name: string;

  @Field({nullable: false})
  isDeleted: boolean;

  @Field({nullable: false})
  guid: string;
}
