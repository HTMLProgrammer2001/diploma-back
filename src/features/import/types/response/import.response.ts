import {Field, Int, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class ImportErrorResponse {
  @Field(returns => Int, {nullable: true})
  row?: number;

  @Field({nullable: true})
  property?: string;

  @Field()
  message: string;
}

@ObjectType()
export class ImportResponse {
  @Field()
  result: boolean;

  @Field(returns => [ImportErrorResponse])
  errors: Array<ImportErrorResponse>;
}
