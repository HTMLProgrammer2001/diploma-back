import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class ExportTypeResponse {
  @Field(type => ID)
  id: number;

  @Field({nullable: false})
  name: string;
}
