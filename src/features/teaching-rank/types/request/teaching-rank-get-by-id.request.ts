import {ArgsType, Field, Int} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';

@ArgsType()
export class TeachingRankGetByIdRequest {
  select: Array<string>;

  @Field(type => Int, {nullable: false})
  @IsNumber()
  id: number;
}
