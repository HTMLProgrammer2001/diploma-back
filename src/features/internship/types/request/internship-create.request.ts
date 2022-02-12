import {Field, ID, InputType, Int} from '@nestjs/graphql';
import {IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min,} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDateRange} from '../../../../global/pipes/validate-date-range';

@InputType()
export class InternshipCreateRequest {
  select: Array<string>;

  @Field({nullable: false})
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field(type => String, {nullable: false})
  @ValidateDateRange()
  from: Date;

  @Field(type => String, {nullable: false})
  @ValidateDateRange()
  to: Date;

  @Field({nullable: false})
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

  @Field(type => Int, {nullable: false})
  @IsNumber()
  @Min(1)
  hours: number;

  @Field({nullable: true})
  @IsOptional()
  @IsNumber()
  @Min(1)
  credits: number;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  userId: number;
}
