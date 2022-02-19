import {Field, ID, InputType} from '@nestjs/graphql';
import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength,} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDateRange} from '../../../../global/pipes/validate-date-range';

@InputType()
export class AttestationCreateRequest {
  select: Array<string>;

  @Field(type => String, {nullable: false})
  @ValidateDateRange()
  date: Date;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  description: string;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  userId: number;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  categoryId: number;
}
