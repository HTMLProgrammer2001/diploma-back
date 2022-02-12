import {Field, ID, InputType} from '@nestjs/graphql';
import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength,} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDateRange} from '../../../../global/pipes/validate-date-range';

@InputType()
export class RebukeCreateRequest {
  select: Array<string>;

  @Field({nullable: false})
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field(type => String, {nullable: true})
  @ValidateDateRange()
  date: Date;

  @Field({nullable: true})
  @IsOptional()
  @MaxLength(255)
  @IsString()
  orderNumber: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  description: string;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  userId: number;

  @Field(type => Boolean, {nullable: true})
  @IsOptional()
  @IsBoolean()
  isActive = true;
}
