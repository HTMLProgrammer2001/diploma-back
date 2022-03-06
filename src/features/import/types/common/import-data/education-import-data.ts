import {Equals, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min} from 'class-validator';
import {ParseNumber} from '../../../../../global/pipes/parse-number';
import {ValidateDateRange} from '../../../../../global/pipes/validate-date-range';
import {Field, ID} from '@nestjs/graphql';

export class EducationImportData {
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  institution: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @IsOptional()
  @MaxLength(255)
  @IsString()
  description: string;

  @IsNumber()
  yearOfIssue: number;

  @ParseNumber()
  @IsNumber()
  teacherId: number;

  @ParseNumber()
  @IsNumber()
  educationQualificationId: number;
}
