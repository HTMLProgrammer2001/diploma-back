import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class AcademicDegreeResponse {
  @Field(type => ID, {nullable: true})
  id: number;

  @Field({nullable: true})
  name: string;

  @Field({nullable: true})
  isDeleted: boolean;

  @Field({nullable: true})
  guid: string;
}
