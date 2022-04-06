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
  MaxLength,
} from 'class-validator';
import {ValidateDate} from '../../../../global/pipes/validate-date';
import {Transform} from 'class-transformer';

@InputType()
export class PublicationCreateRequest {
  select: Array<string>;

  @Field({nullable: false})
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field(type => String, {nullable: false})
  @ValidateDate()
  date: Date;

  @Field({nullable: true})
  @IsOptional()
  @MaxLength(255)
  @IsString()
  publisher?: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @IsUrl()
  url?: string;

  @Field({nullable: true})
  @IsOptional()
  @MaxLength(255)
  @IsString()
  anotherAuthors?: string;

  @Field({nullable: true})
  @IsOptional()
  @IsString()
  description?: string;

  @Field(type => [ID], {nullable: false})
  @Transform(({value}) => Array.isArray(value) ? value.map(el => Number(el)) : [])
  @IsArray()
  @IsNumber({}, {each: true})
  @ArrayUnique()
  @ArrayMinSize(1)
  teacherIds: Array<number>;
}
