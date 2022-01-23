import {ArgsType, Field} from '@nestjs/graphql';
import {IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';

@ArgsType()
export class TeachingRankUpdateRequest {
  select: Array<string>;

  @Field({nullable: false})
  @IsNumber()
  id: number;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  name: string;

  @Field({nullable: false})
  @IsNotEmpty()
  @IsString()
  guid: string;
}
