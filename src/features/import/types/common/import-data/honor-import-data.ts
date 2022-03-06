import {Equals, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min} from 'class-validator';
import {ParseNumber} from '../../../../../global/pipes/parse-number';
import {ValidateDateRange} from '../../../../../global/pipes/validate-date-range';
import {Field, ID} from '@nestjs/graphql';

export class HonorImportData {
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  title: string;

  @ValidateDateRange()
  date: Date;

  @IsOptional()
  @MaxLength(255)
  @IsString()
  orderNumber: string;

  @IsOptional()
  @IsString()
  description: string;

  @ParseNumber()
  @IsNumber()
  teacherId: number;

  @IsOptional()
  @IsBoolean()
  isActive = true;
}
