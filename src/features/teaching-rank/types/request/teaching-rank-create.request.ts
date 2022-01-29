import {ArgsType, Field} from '@nestjs/graphql';
import {IsNotEmpty, IsString, MaxLength} from 'class-validator';

@ArgsType()
export class TeachingRankCreateRequest {
  select: Array<string>;

  @Field({nullable: false})
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  name: string;
}
