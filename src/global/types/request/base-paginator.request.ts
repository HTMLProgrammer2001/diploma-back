import {Field, InputType, Int} from '@nestjs/graphql';

@InputType()
export class BasePaginatorRequest {
  @Field(type => Int, {nullable: true})
  page: number = 1;

  @Field(type => Int, {nullable: true})
  size: number = 5;
}
