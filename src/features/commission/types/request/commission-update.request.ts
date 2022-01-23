import {ArgsType, Field, Int} from '@nestjs/graphql';
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

@ArgsType()
export class CommissionUpdateRequest {
  select: Array<string>;

  @Field(type => Int, {nullable: false})
  @IsNumber()
  id: number;

  @Field({nullable: true})
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({nullable: false})
  @IsNotEmpty()
  @IsString()
  guid: string;
}
