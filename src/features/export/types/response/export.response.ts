import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class ExportResponse {
  @Field()
  url: string;
}
