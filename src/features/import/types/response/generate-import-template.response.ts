import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class GenerateImportTemplateResponse {
  @Field()
  url: string;
}
