import {Equals, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min} from 'class-validator';
import {ParseNumber} from '../../../../../global/pipes/parse-number';
import {ValidateDateRange} from '../../../../../global/pipes/validate-date-range';

export class InternshipImportData {
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  title: string;

  @ValidateDateRange()
  from: Date;

  @ValidateDateRange()
  to: Date;

  @MaxLength(255)
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  place: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  hours: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  credits: number;

  @ParseNumber()
  @IsNumber()
  teacherId: number;

  @Equals(true, {message: 'To must be greater than from'})
  isToMoreThanFrom: boolean;
}
