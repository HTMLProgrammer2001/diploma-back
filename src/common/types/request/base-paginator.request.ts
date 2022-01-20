import {ArgsType, Field} from '@nestjs/graphql';

@ArgsType()
export class BasePaginatorRequest {
  @Field({nullable: true})
  page: number = 1;

  @Field({nullable: true})
  size: number = 5;
}
