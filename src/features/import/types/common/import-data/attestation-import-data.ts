import {IsNumber, IsOptional, IsString} from 'class-validator';
import {ParseNumber} from '../../../../../global/pipes/parse-number';
import {ValidateDateRange} from '../../../../../global/pipes/validate-date-range';

export class AttestationImportData {
  @ValidateDateRange()
  date: Date;

  @IsOptional()
  @IsString()
  description: string;

  @ParseNumber()
  @IsNumber()
  teacherId: number;

  @ParseNumber()
  @IsNumber()
  categoryId: number;
}
