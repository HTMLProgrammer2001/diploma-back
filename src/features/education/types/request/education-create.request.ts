import {Field, ID, InputType} from '@nestjs/graphql';
import {IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength,} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';

@InputType()
export class EducationCreateRequest {
  select: Array<string>;

  @Field({nullable: false})
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  institution: string;

  @Field({nullable: false})
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @Field({nullable: true})
  @IsOptional()
  @MaxLength(65335)
  @IsString()
  description: string;

  @Field({nullable: false})
  @IsNumber()
  yearOfIssue: number;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  teacherId: number;

  @Field(type => ID, {nullable: false})
  @ParseNumber()
  @IsNumber()
  educationQualificationId: number;
}
