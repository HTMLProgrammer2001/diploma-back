import {Field, ID, InputType} from '@nestjs/graphql';
import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDateRange} from '../../../../global/pipes/validate-date-range';

@InputType()
export class RebukeUpdateRequest {
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
  teacherId: number;

  @Field({nullable: true})
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
