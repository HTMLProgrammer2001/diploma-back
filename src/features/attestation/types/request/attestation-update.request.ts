import {Field, ID, InputType} from '@nestjs/graphql';
import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDateRange} from '../../../../global/pipes/validate-date-range';

@InputType()
export class AttestationUpdateRequest {
  select: Array<string>;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  id: number;

  @Field({nullable: false})
  @IsNotEmpty()
  @IsString()
  guid: string;

  @Field(type => String, {nullable: true})
  @IsOptional()
  @ValidateDateRange()
  date: Date;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  description: string;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  userId: number;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  categoryId: number;
}
