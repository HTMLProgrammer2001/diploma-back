import {Field, ID, InputType} from '@nestjs/graphql';
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
import {Transform} from 'class-transformer';
import {ParseNumber} from '../../../../global/pipes/parse-number';
import {ValidateDateRange} from '../../../../global/pipes/validate-date-range';

@InputType()
export class PublicationUpdateRequest {
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
  @IsString()
  publisher?: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  anotherAuthors?: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  description?: string;

  @Field(type => [ID], {nullable: true})
  @IsOptional()
  @Transform(({value}) => Array.isArray(value) ? value.map(el => Number(el)) : [])
  @IsArray()
  @IsNumber({}, {each: true})
  @ArrayUnique()
  @ArrayMinSize(1)
  userIds: Array<number>;
}
