import {Field, ID, InputType} from '@nestjs/graphql';
import {IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';

@InputType()
export class ImportTypeUpdateRequest {
  select: Array<string>;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
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
