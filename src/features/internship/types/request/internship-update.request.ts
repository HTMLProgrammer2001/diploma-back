import {Field, ID, InputType, Int} from '@nestjs/graphql';
import {IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDateRange} from '../../../../global/pipes/validate-date-range';

@InputType()
export class InternshipUpdateRequest {
  select: Array<string>;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  id: number;

  @Field({nullable: false})
  @IsNotEmpty()
  @IsString()
  guid: string;

  @Field({nullable: true})
  @IsOptional()
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field(type => String, {nullable: true})
  @IsOptional()
  @ValidateDateRange()
  from: Date;

  @Field(type => String, {nullable: true})
  @IsOptional()
  @ValidateDateRange()
  to: Date;

  @Field({nullable: true})
  @IsOptional()
  @MaxLength(255)
  @IsString()
  code: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  place: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  description: string;

  @Field(type => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  @Min(1)
  hours: number;

  @Field({nullable: true})
  @IsOptional()
  @IsNumber()
  @Min(1)
  credits: number;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  userId: number;
}
