import {IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, MaxLength} from 'class-validator';
import {ParseNumber} from '../../../../../global/pipes/parse-number';
import {ValidateDateRange} from '../../../../../global/pipes/validate-date-range';

export class TeacherImportData {
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @ValidateDateRange()
  birthday: Date;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('UA')
  phone: string;

  @IsOptional()
  @IsString()
  address: string;

  @ParseNumber()
  @IsNumber()
  departmentId: number;

  @ParseNumber()
  @IsNumber()
  commissionId: number;

  @IsOptional()
  @ParseNumber()
  @IsNumber()
  teacherRankId: number;

  @IsOptional()
  @ParseNumber()
  @IsNumber()
  academicDegreeId: number;

  @IsOptional()
  @ParseNumber()
  @IsNumber()
  academicTitleId: number;

  @IsOptional()
  @ValidateDateRange()
  workStartDate: Date;
}
