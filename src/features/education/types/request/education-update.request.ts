import {Field, ID, InputType} from '@nestjs/graphql';
import {IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength} from 'class-validator';
import {ParseNumber} from '../../../../global/pipes/parse-number';

@InputType()
export class EducationUpdateRequest {
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
  institution: string;

  @Field({nullable: true})
  @IsOptional()
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @Field({nullable: true})
  @IsOptional()
  @MaxLength(255)
  @IsString()
  description: string;

  @Field({nullable: true})
  @IsOptional()
  @IsNumber()
  yearOfIssue: number;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  userId: number;

  @Field(type => ID, {nullable: true})
  @IsOptional()
  @ParseNumber()
  @IsNumber()
  educationQualificationId: number;
}
