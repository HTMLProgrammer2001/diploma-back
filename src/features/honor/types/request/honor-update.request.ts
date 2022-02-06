import {Field, ID, InputType} from '@nestjs/graphql';
import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate, MaxLength, MinDate} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDate} from '../../../../global/pipes/validate-date';

@InputType()
export class HonorUpdateRequest {
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
  @MaxDate(new Date())
  @MinDate(new Date(Date.now() - 100 * 365 * 24 * 60 * 60 * 1000))
  @ValidateDate()
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

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  userId: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
