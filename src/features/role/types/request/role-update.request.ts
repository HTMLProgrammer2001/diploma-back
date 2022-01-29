import {ArgsType, Field, Int} from '@nestjs/graphql';
import {IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';

@ArgsType()
export class RoleUpdateRequest {
  select: Array<string>;

  @Field(type => Int, {nullable: false})
  @IsNumber()
  id: number;

  @Field({nullable: true})
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({nullable: false})
  @IsNotEmpty()
  @IsString()
  guid: string;
}
