import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import {ParseNumber} from '../../../../../global/pipes/parse-number';

export class UserImportData {
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @MinLength(8)
  @IsAlphanumeric()
  @IsString()
  password: string;

  passwordHash: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('UA')
  phone: string;

  @ParseNumber()
  @IsNumber()
  roleId: number;
}
