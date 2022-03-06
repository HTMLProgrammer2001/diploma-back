import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength
} from 'class-validator';
import {ValidateDate} from '../../../../../global/pipes/validate-date';
import {Transform} from 'class-transformer';

export class PublicationImportData {
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  title: string;

  @ValidateDate()
  date: Date;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  anotherAuthors?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Transform(({value}) => Array.isArray(value) ? value.map(el => Number(el)) : [])
  @IsArray()
  @IsNumber({}, {each: true})
  @ArrayUnique()
  @ArrayMinSize(1)
  teacherIds: Array<number>;
}
